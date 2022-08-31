import {
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Address } from 'src/address/entities/address.entity';
import { Role } from 'src/role/role.enum';

@Table
class User extends Model {
  @Column({ primaryKey: true })
  id: string;

  @Column
  name: string;

  @Column
  email: string;

  @Column
  phone: string;

  @Column
  password: string;

  @Default('user')
  @Column(DataType.STRING)
  roles: Role[];

  @HasMany(() => Address)
  addresses: Address[];
}

export { User };
