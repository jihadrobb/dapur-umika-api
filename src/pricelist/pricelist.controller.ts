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
  Res,
  HttpStatus,
} from '@nestjs/common';
import { PricelistService } from './pricelist.service';
import { CreatePricelistDto } from './dto/create-pricelist.dto';
import { UpdatePricelistDto } from './dto/update-pricelist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('pricelists')
export class PricelistController {
  constructor(private readonly pricelistService: PricelistService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createPricelistDto: CreatePricelistDto,
    @UploadedFile() image: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = await this.pricelistService.create(
      createPricelistDto,
      image,
    );
    return res.status(HttpStatus.CREATED).json({
      isSuccessful: true,
      message: 'Pricelist created',
      payload,
    });
  }

  @Get()
  async findAll(@Res({ passthrough: true }) res: Response) {
    const payload = await this.pricelistService.findAll();
    return res.status(HttpStatus.OK).json({
      isSuccessful: true,
      payload,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = await this.pricelistService.findOne(id);
    return res.status(HttpStatus.OK).json({
      isSuccessful: true,
      payload,
    });
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updatePricelistDto: UpdatePricelistDto,
    @UploadedFile() image: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = await this.pricelistService.update(
      id,
      updatePricelistDto,
      image,
    );
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Data updated', payload });
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.pricelistService.remove(id);
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Data deleted' });
  }
}
