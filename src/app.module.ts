import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PricelistModule } from './pricelist/pricelist.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ProductModule } from './product/product.module';
import { ImageModule } from './image/image.module';
import { Pricelist } from './pricelist/entities/pricelist.entity';
import { Product } from './product/entities/product.entity';
import { Image } from './image/entities/image.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      // uri: process.env.DATABASE_URL2,
      uri: process.env.DATABASE_URL_LOCAL,
      autoLoadModels: true,
      synchronize: true,
      models: [Pricelist, Image, Product],
    }),
    PricelistModule,
    CloudinaryModule,
    ProductModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
