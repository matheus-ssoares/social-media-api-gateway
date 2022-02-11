import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { models } from '.';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'postgres',
  port: Number(process.env.DB_PORT) || 5432,
  host: process.env.NODE_ENV == 'development' ? 'localhost' : '',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  models,
  database: process.env.DB_NAME,
  logging: true,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });
