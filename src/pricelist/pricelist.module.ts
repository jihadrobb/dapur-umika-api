import { Module } from '@nestjs/common';
import { PricelistService } from './pricelist.service';
import { PricelistController } from './pricelist.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pricelist } from './entities/pricelist.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [SequelizeModule.forFeature([Pricelist]), CloudinaryModule],
  controllers: [PricelistController],
  providers: [PricelistService],
})
export class PricelistModule {}
