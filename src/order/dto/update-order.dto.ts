import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsOptional, IsIn, IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsNotEmpty()
  pickupType?: string;

  @IsOptional()
  @IsNotEmpty()
  resiNumber?: string;

  @IsOptional()
  @IsNotEmpty()
  paymentMethod?: string;

  @IsOptional()
  @IsIn(['unpaid', 'paid', 'sent', 'completed'])
  status?: 'unpaid' | 'paid' | 'sent' | 'completed';

  @IsOptional()
  @IsBoolean()
  isCheckedOut?: boolean;
}
