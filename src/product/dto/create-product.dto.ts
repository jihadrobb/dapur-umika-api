import { MinLength, Min, IsOptional, IsNumberString } from 'class-validator';

export class CreateProductDto {
  @MinLength(5)
  name: string;

  @MinLength(5)
  type: string;

  @MinLength(8)
  description: string;

  @IsNumberString()
  price: number; // in rupiah

  @IsNumberString()
  weight: number; // in gram

  @IsOptional()
  portion?: string;

  @IsNumberString()
  stock: number;
}
