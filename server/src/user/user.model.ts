import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserRegistrationAttributes {
  email: string;
  password: string;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserRegistrationAttributes> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
  })
  image: string | null;

  @Column({
    type: 'BYTEA',
  })
  pdf: BinaryData | null;

  @Column({
    type: DataType.STRING,
  })
  hashedRt: string | null;
}
