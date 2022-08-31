import { PartialType } from '@nestjs/mapped-types';
import { CreatePricelistDto } from './create-pricelist.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePricelistDto extends PartialType(CreatePricelistDto) {
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
