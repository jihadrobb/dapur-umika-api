export class FindAllOrderDto {
  pickupType: string;
  paymentMethod: string;
  status: 'unpaid' | 'paid' | 'sent' | 'completed';
  userId: string;
  productId: string;
}
