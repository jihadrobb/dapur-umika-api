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
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { Address } from './address/entities/address.entity';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      uri: process.env.DATABASE_URL_FLY,
      // uri: process.env.DATABASE_URL_LOCAL,
      autoLoadModels: true,
      synchronize: true,
      models: [Address, Image, Order, Pricelist, Product, User],
    }),
    AddressModule,
    AuthModule,
    CloudinaryModule,
    ImageModule,
    OrderModule,
    PricelistModule,
    ProductModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
