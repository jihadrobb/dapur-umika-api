import { Module } from '@nestjs/common';
import { PricelistService } from './pricelist.service';
import { PricelistController } from './pricelist.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pricelist } from './entities/pricelist.entity';
import { ImageModule } from 'src/image/image.module';
import { Image } from 'src/image/entities/image.entity';

@Module({
  imports: [SequelizeModule.forFeature([Pricelist]), ImageModule],
  controllers: [PricelistController],
  providers: [PricelistService],
})
export class PricelistModule {}
