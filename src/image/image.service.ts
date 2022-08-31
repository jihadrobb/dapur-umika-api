import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { v4 as uuidv4 } from 'uuid';
import { Image } from './entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image)
    private imageModel: typeof Image,
    private cloudinary: CloudinaryService,
  ) {}

  async create(
    file: Express.Multer.File,
    type: 'Pricelist' | 'Product' | 'Receipt',
    foreignId: string,
  ) {
    const cloudinaryResponse = await this.cloudinary
      .uploadImage(file, type)
      .catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
    const generatedId = uuidv4();
    let pricelistId = null,
      productId = null,
      transferReceiptId = null;
    switch (type) {
      case 'Pricelist':
        pricelistId = foreignId;
        break;
      case 'Product':
        productId = foreignId;
        break;
      case 'Receipt':
        transferReceiptId = foreignId;
        break;
    }
    return this.imageModel.create({
      id: generatedId,
      imgUrl: cloudinaryResponse.secure_url,
      cdnPublicId: cloudinaryResponse.public_id,
      pricelistId,
      productId,
      transferReceiptId,
    });
  }

  async findAllByType(type: string, foreignId: string) {
    let pricelistId = null,
      productId = null,
      transferReceiptId = null;
    switch (type) {
      case 'Pricelist':
        pricelistId = foreignId;
        break;
      case 'Product':
        productId = foreignId;
        break;
      case 'Receipt':
        transferReceiptId = foreignId;
        break;
    }
    return this.imageModel.findAll({
      where: { pricelistId, productId, transferReceiptId },
    });
  }

  async findOne(id: string) {
    return this.imageModel.findByPk(id);
  }

  async update(id: string, file: Express.Multer.File) {
    const image = await this.imageModel.findByPk(id);
    if (!image) throw new NotFoundException('Image not found');

    const type = image.pricelistId
      ? 'Pricelist'
      : image.productId
      ? 'Product'
      : 'Receipt';
    const cloudinaryResponse = await this.cloudinary
      .uploadImage(file, type)
      .catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
    await this.cloudinary.deleteImage(image.cdnPublicId);
    return this.imageModel.update(
      {
        imgUrl: cloudinaryResponse.secure_url,
        cdnPublicId: cloudinaryResponse.public_id,
      },
      { where: { id } },
    );
  }

  async remove(id: string) {
    const image = await this.imageModel.findByPk(id);
    if (!image) throw new NotFoundException('Image not found');

    await this.cloudinary.deleteImage(image.cdnPublicId);
    return this.imageModel.destroy({ where: { id } });
  }
}
