import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Pricelist } from 'src/pricelist/entities/pricelist.entity';
import { Product } from 'src/product/entities/product.entity';

@Table
class Image extends Model {
  @Column({ primaryKey: true })
  id: string;

  @Column
  imgUrl: string; // cloudinary url

  @Column
  cdnPublicId: string; // cloudinary public id for deleting image

  @ForeignKey(() => Pricelist)
  @Column
  pricelistId: string;

  @ForeignKey(() => Product)
  @Column
  productId: string;

  @BelongsTo(() => Pricelist)
  pricelist: Pricelist;

  @BelongsTo(() => Product)
  product: Product;
}

export { Image };
