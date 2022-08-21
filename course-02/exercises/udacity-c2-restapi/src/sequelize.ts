import {Sequelize} from 'sequelize-typescript';
import { config } from './config/config';


const c = config.dev;

// Instantiate new Sequelize instance!
export const sequelize = new Sequelize(
  c.database,
  c.username,
  c.password,
  {
  host: c.host,
  dialect: 'postgres',
  storage: ':memory:',
  }
);

