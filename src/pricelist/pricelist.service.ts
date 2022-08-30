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
import { ImageService } from 'src/image/image.service';
import { Image } from 'src/image/entities/image.entity';

@Injectable()
export class PricelistService {
  constructor(
    @InjectModel(Pricelist)
    private pricelistModel: typeof Pricelist,
    private imageService: ImageService,
  ) {}

  async create(body: CreatePricelistDto, file: Express.Multer.File) {
    const { name } = body;
    const generatedId = uuidv4();
    await this.pricelistModel.create({
      id: generatedId,
      name,
    });
    await this.imageService.create(file, 'Pricelist', generatedId);

    return this.pricelistModel.findByPk(generatedId, {
      include: {
        model: Image,
        attributes: ['id', 'imgUrl'],
      },
    });
  }

  async findAll() {
    return this.pricelistModel.findAll({
      where: { isActive: true },
      include: {
        model: Image,
        attributes: ['id', 'imgUrl'],
      },
    });
  }

  async findOne(id: string) {
    const pricelist = await this.pricelistModel.findByPk(id, {
      include: {
        model: Image,
        attributes: ['id', 'imgUrl'],
      },
    });
    if (!pricelist) throw new NotFoundException('Pricelist not found');
    return pricelist;
  }

  async update(
    id: string,
    body: UpdatePricelistDto,
    file: Express.Multer.File,
  ) {
    const pricelist = await this.pricelistModel.findByPk(id, {
      include: {
        model: Image,
      },
    });
    if (!pricelist) throw new NotFoundException('Pricelist not found');

    if (file) {
      const { image } = pricelist;
      await this.imageService.update(image.id, file);
    }

    await this.pricelistModel.update(body, { where: { id }, returning: true });
    return this.pricelistModel.findByPk(id, {
      include: {
        model: Image,
        attributes: ['id', 'imgUrl'],
      },
    });
  }

  async remove(id: string) {
    const pricelist = await this.pricelistModel.findByPk(id, {
      include: { model: Image },
    });
    if (!pricelist) throw new NotFoundException('Pricelist not found');

    await this.imageService.remove(pricelist.image.id);
    await this.pricelistModel.destroy({ where: { id } });
  }
}
