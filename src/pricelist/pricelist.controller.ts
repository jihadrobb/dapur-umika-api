import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PricelistService } from './pricelist.service';
import { CreatePricelistDto } from './dto/create-pricelist.dto';
import { UpdatePricelistDto } from './dto/update-pricelist.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pricelist')
export class PricelistController {
  constructor(private readonly pricelistService: PricelistService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createPricelistDto: CreatePricelistDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.pricelistService.create(createPricelistDto, image);
  }

  @Get()
  findAll() {
    return this.pricelistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pricelistService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updatePricelistDto: UpdatePricelistDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.pricelistService.update(id, updatePricelistDto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pricelistService.remove(id);
  }
}
