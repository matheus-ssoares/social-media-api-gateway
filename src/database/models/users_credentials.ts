import {
  Model,
  PrimaryKey,
  Table,
  Column,
  AutoIncrement,
} from 'sequelize-typescript';
import { Optional } from 'sequelize/types';

interface UsersCredentialsAttributes {
  id: string;
  email: string;
  password: string;
  credential_token_version: number;
  external_id: string;
  createdAt: Date;
  updatedAt: Date;
}

type UsersCredentialsAttributesType = Optional<
  UsersCredentialsAttributes,
  'id' | 'external_id'
>;

@Table
export class users_credentials extends Model<
  UsersCredentialsAttributes,
  UsersCredentialsAttributesType
> {
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
  external_id: string;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
