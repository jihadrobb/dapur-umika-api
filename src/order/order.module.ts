import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [SequelizeModule.forFeature([Order]), ImageModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
