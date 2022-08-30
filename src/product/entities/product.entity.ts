import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Image } from 'src/image/entities/image.entity';

@Table
class Product extends Model {
  @Column({ primaryKey: true })
  id: string;

  @Column
  name: string;

  @Column
  type: string;

  @Column
  description: string;

  @Column
  price: number; // in rupiah

  @Column
  weight: number; // in gram

  @Column
  portion: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @HasMany(() => Image)
  images: Image[];
}

export { Product };
