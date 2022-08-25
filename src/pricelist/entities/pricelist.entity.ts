import { Column, Model, Table } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table
class Pricelist extends Model {
  @Column({ primaryKey: true })
  id: string;

  @Column
  name: string;

  @Column
  imgUrl: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @Column
  cdnPublicId: string; // cloudinary public id for deleting image
}

export { Pricelist };
