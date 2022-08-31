import { IsNotEmpty, IsNumber, Min } from 'class-validator';
export class CreateOrderDto {
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
