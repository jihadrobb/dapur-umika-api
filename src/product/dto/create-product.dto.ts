export class CreateProductDto {
  name: string;
  type: string;
  description: string;
  price: number; // in rupiah
  weight: number; // in gram
  portion: string;
}
