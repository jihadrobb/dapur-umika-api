import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class FindAllOrderDto {
  @IsOptional()
  @IsNotEmpty()
  pickupType?: string;

  @IsOptional()
  @IsNotEmpty()
  paymentMethod?: string;

  @IsOptional()
  @IsIn(['unpaid', 'paid', 'sent', 'completed'])
  status?: 'unpaid' | 'paid' | 'sent' | 'completed';

  @IsOptional()
  @IsNotEmpty()
  userId?: string;

  @IsOptional()
  @IsNotEmpty()
  productId?: string;
}
