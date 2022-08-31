import { MinLength } from 'class-validator';

export class CreatePricelistDto {
  @MinLength(5)
  name: string;
}
