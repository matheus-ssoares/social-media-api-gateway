import {
  Model,
  PrimaryKey,
  Table,
  Column,
  AutoIncrement,
} from 'sequelize-typescript';

@Table
export class users_credentials extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  credential_token_version: number;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
