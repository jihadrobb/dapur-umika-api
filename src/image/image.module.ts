import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image } from './entities/image.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [SequelizeModule.forFeature([Image]), CloudinaryModule],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
