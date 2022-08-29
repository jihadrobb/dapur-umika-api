import { Column, HasOne, Model, Table } from 'sequelize-typescript';
import { Image } from 'src/image/entities/image.entity';

@Table
class Pricelist extends Model {
  @Column({ primaryKey: true })
  id: string;

  @Column
  name: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @HasOne(() => Image)
  image: Image;
}

export { Pricelist };
