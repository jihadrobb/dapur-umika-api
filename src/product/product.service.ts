import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from 'src/image/entities/image.entity';
import { ImageService } from 'src/image/image.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    private imageService: ImageService,
  ) {}

  async create(body: CreateProductDto, images: Express.Multer.File[]) {
    const product = await this.productModel.findOne({
      where: { name: body.name },
    });
    if (product) throw new ConflictException('Product already exists');

    const generatedId = uuidv4();
    await this.productModel.create({
      id: generatedId,
      ...body,
    });
    await Promise.all(
      images.map((img: Express.Multer.File) =>
        this.imageService.create(img, 'Product', generatedId),
      ),
    );

    return this.productModel.findByPk(generatedId, {
      include: {
        model: Image,
        attributes: ['id', 'imgUrl'],
      },
    });
  }

  async findAll(search: string) {
    return this.productModel.findAll({
      where: { isActive: true, name: { [Op.iLike]: `%${search}%` } },
      include: {
        model: Image,
        attributes: ['id', 'imgUrl'],
      },
    });
  }

  async findOne(id: string) {
    return this.productModel.findByPk(id, {
      include: {
        model: Image,
        attributes: ['id', 'imgUrl'],
      },
    });
  }

  async update(id: string, body: UpdateProductDto) {
    let product = await this.productModel.findOne({
      where: { name: body.name },
    });
    if (product)
      throw new ConflictException('Product with this name already exists');

    product = await this.productModel.findByPk(id);
    if (!product) throw new NotFoundException('Product not found');

    await this.productModel.update(
      { ...body, isActive: body.stock > 0 },
      { where: { id } },
    );
    return this.productModel.findByPk(id, {
      include: {
        model: Image,
        attributes: ['id', 'imgUrl'],
      },
    });
  }

  async addImage(productId: string, images: Express.Multer.File[]) {
    await Promise.all(
      images.map((img: Express.Multer.File) =>
        this.imageService.create(img, 'Product', productId),
      ),
    );
  }

  async removeImage(imageId: string) {
    await this.imageService.remove(imageId);
  }

  async remove(id: string) {
    const product = await this.productModel.findByPk(id, {
      include: { model: Image },
    });
    if (!product) throw new NotFoundException('Product not found');

    await Promise.all(
      product.images.map((img) => this.imageService.remove(img.id)),
    );
    return this.productModel.destroy({ where: { id } });
  }
}
