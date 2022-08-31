import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';

@Table
class Address extends Model {
  @Column({ primaryKey: true })
  id: string;

  @Column
  name: string;

  @Column
  detail: string;

  @ForeignKey(() => User)
  @Column
  userId: string;

  @BelongsTo(() => User)
  user: User;
}

export { Address };
