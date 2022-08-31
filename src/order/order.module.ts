import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { ImageModule } from 'src/image/image.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [SequelizeModule.forFeature([Order]), ImageModule, ProductModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
