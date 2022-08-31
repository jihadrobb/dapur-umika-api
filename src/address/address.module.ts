import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';

@Module({
  imports: [SequelizeModule.forFeature([Address])],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
