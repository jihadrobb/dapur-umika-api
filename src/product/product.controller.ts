import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Res,
  UploadedFile,
  HttpStatus,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images[]', 10))
  async create(
    @Body() body: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = await this.productService.create(body, images);
    return res.status(HttpStatus.CREATED).json({
      isSuccessful: true,
      message: 'Product created',
      payload,
    });
  }

  @Get()
  async findAll(@Res({ passthrough: true }) res: Response) {
    const payload = await this.productService.findAll();
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
    const payload = await this.productService.findOne(id);
    return res.status(HttpStatus.OK).json({
      isSuccessful: true,
      payload,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = await this.productService.update(id, body);
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Data updated', payload });
  }

  @Post('image/:productId')
  @UseInterceptors(FilesInterceptor('images[]', 10))
  async addImage(
    @Param('productId') productId: string,
    @UploadedFiles() images: Express.Multer.File[],
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.productService.addImage(productId, images);
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Image uploaded' });
  }

  @Delete('image/:imageId')
  async removeImage(
    @Param('imageId') imageId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.productService.removeImage(imageId);
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Image deleted' });
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.productService.remove(id);
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Data deleted' });
  }
}
