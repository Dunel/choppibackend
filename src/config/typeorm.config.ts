import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';

const env = (key: string, fallback?: string) => process.env[key] ?? fallback;

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: env('DB_HOST', process.env.DB_HOST),
  port: Number(env('DB_PORT', process.env.DB_PORT)),
  username: env('DB_USER', process.env.DB_USER),
  password: env('DB_PASSWORD', process.env.DB_PASSWORD),
  database: env('DB_NAME', process.env.DB_NAME),
  autoLoadEntities: true,
  synchronize: env('DB_SYNC', process.env.DB_SYNC) === 'true',
  ssl: env('DB_SSL', process.env.DB_SSL) === 'true' ? { rejectUnauthorized: false } : false,
};
