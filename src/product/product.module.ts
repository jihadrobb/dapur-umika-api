import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ImageModule } from 'src/image/image.module';
import { Product } from './entities/product.entity';

@Module({
  imports: [SequelizeModule.forFeature([Product]), ImageModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
