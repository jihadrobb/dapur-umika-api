import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ImageService } from 'src/image/image.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { v4 as uuidv4 } from 'uuid';
import { Product } from 'src/product/entities/product.entity';
import { Image } from 'src/image/entities/image.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    private imageService: ImageService,
    private productService: ProductService,
  ) {}

  async create(userId: string, body: CreateOrderDto) {
    const { productId, amount } = body;

    const product = await this.productService.findOne(productId);
    if (!product) throw new NotFoundException('Product not found');

    const order = await this.orderModel.findOne({
      where: { userId, productId },
    });

    if (order) {
      const newAmount: number = order.amount + amount;
      return this.update(order.id, {
        amount: newAmount,
      });
    }

    const generatedId = uuidv4();
    await this.orderModel.create({
      id: generatedId,
      amount,
      price: amount * product.getDataValue('price'),
      userId,
      productId,
    });
    return this.getDetailOrder(generatedId);
  }

  async findAll(options?: any) {
    return this.orderModel.findAll({
      where: { ...options },
      include: [
        {
          model: Product,
          attributes: { exclude: ['isActive', 'createdAt', 'updatedAt'] },
          include: [{ model: Image, attributes: ['id', 'imgUrl'] }],
        },
        {
          model: Image,
          attributes: ['id', 'imgUrl'],
        },
      ],
    });
  }

  async update(id: string, body: UpdateOrderDto, image?: Express.Multer.File) {
    const order = await this.getDetailOrder(id);
    if (!order) throw new NotFoundException('Order not found');

    if (image) {
      const { transferReceipt } = order;
      transferReceipt
        ? await this.imageService.update(transferReceipt.id, image)
        : await this.imageService.create(image, 'Receipt', id);
    }

    const amount = body.amount || order.getDataValue('amount');
    const price = order.getDataValue('product').price * amount;

    await this.orderModel.update({ ...body, amount, price }, { where: { id } });
    return this.getDetailOrder(id);
  }

  async remove(id: string) {
    const order = await this.getDetailOrder(id);
    if (!order) throw new NotFoundException('Order not found');

    order.transferReceipt &&
      (await this.imageService.remove(order.transferReceipt.id));
    return this.orderModel.destroy({ where: { id } });
  }

  async getDetailOrder(id: string) {
    return this.orderModel.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: { exclude: ['isActive', 'createdAt', 'updatedAt'] },
          include: [{ model: Image, attributes: ['id', 'imgUrl'] }],
        },
        {
          model: Image,
          attributes: ['id', 'imgUrl'],
        },
      ],
    });
  }
}
