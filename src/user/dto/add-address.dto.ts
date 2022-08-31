import { MinLength } from 'class-validator';
export class AddAddressDto {
  @MinLength(5)
  name: string;

  @MinLength(8)
  detail: string;
}
