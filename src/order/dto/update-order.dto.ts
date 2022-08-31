import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  pickupType: string;
  resiNumber: string;
  paymentMethod: string;
  status: 'unpaid' | 'paid' | 'sent' | 'completed';
  isCheckedOut: boolean;
}
