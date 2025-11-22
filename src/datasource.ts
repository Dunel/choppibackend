import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { Store } from './entities/store.entity';
import { Product } from './entities/product.entity';
import { StoreProduct } from './entities/store-product.entity';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'postgres',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: false,
  entities: [User, Store, Product, StoreProduct],
  migrations: ['src/migrations/*.ts'],
};

export default new DataSource(dataSourceOptions);
