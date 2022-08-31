import {
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Image } from 'src/image/entities/image.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Table
class Order extends Model {
  @Column({ primaryKey: true })
  id: string;

  @Column
  pickupType: string;

  @Column
  resiNumber: string;

  @Column
  paymentMethod: string;

  @Column
  status: string;

  @Column
  isCheckedOut: boolean;

  @ForeignKey(() => User)
  userId: User;

  @ForeignKey(() => Product)
  productId: Product;

  @BelongsTo(() => User)
  orderedBy: User;

  @BelongsTo(() => Product)
  product: Product;

  @HasOne(() => Image)
  transferReceipt: Image;
}

export { Order };
