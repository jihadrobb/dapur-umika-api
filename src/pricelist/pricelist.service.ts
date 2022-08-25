import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePricelistDto } from './dto/create-pricelist.dto';
import { UpdatePricelistDto } from './dto/update-pricelist.dto';
import { Pricelist } from './entities/pricelist.entity';
import { v4 as uuidv4 } from 'uuid';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PricelistService {
  constructor(
    @InjectModel(Pricelist)
    private pricelistModel: typeof Pricelist,
    private cloudinary: CloudinaryService,
  ) {}

  async create(body: CreatePricelistDto, image: Express.Multer.File) {
    const { name } = body;
    const cloudinaryResponse = await this.cloudinary
      .uploadImage(image, 'Pricelist')
      .catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
    const generateId = uuidv4();
    const pricelist = await this.pricelistModel.create({
      id: generateId,
      name,
      imgUrl: cloudinaryResponse.secure_url,
      isActive: true,
      cdnPublicId: cloudinaryResponse.public_id,
    });
    return this.pricelistModel.findByPk(generateId, {
      attributes: {
        exclude: ['cdnPublicId'],
      },
    });
  }

  async findAll() {
    return await this.pricelistModel.findAll();
  }

  async findOne(id: string) {
    const pricelist = await this.pricelistModel.findByPk(id);
    if (!pricelist) throw new NotFoundException('Pricelist not found');
    return pricelist;
  }

  async update(
    id: string,
    body: UpdatePricelistDto,
    image: Express.Multer.File,
  ) {
    const { name, isActive } = body;
    const pricelist = await this.pricelistModel.findByPk(id);
    if (!pricelist) throw new NotFoundException('Pricelist not found');
    let imgUrl = pricelist.getDataValue('imgUrl');

    if (image) {
      const cloudinaryResponse = await this.cloudinary
        .uploadImage(image, 'Pricelist')
        .catch(() => {
          throw new BadRequestException('Invalid file type.');
        });
      imgUrl = cloudinaryResponse.secure_url;
    }

    const newPricelist = await this.pricelistModel.update(
      {
        name: name || pricelist.name,
        isActive: isActive || pricelist.isActive,
        imgUrl,
      },
      { where: { id }, returning: true },
    );
    return newPricelist[1][0];
  }

  async remove(id: string) {
    const pricelist = await this.pricelistModel.findByPk(id);
    if (!pricelist) throw new NotFoundException('Pricelist not found');
    await this.cloudinary.deleteImage(pricelist.cdnPublicId);
    await this.pricelistModel.destroy({ where: { id } });
  }
}
