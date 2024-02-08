import 'dotenv/config';
import { DataSource } from 'typeorm';

/*import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../src/!**!/!*.entity.{ts,js}'],
  /!* Note : it is unsafe to use synchronize: true for schema synchronization
    on production once you get data in your database. *!/
  // synchronize: true,
  autoLoadEntities: true,
};
export const OrmConfig = {
  ...typeOrmModuleOptions,
  migrationsTableName: 'migrations',
  migrations: ['./migrations/!*.ts'],
  seeds: ['./seeds/!**!/!*{.ts,.js}'],
  cli: {
    migrationsDir: './migrations',
  },
};
export default OrmConfig;*/

export default new DataSource({
  type: 'mysql',

  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
  logging: process.env.DATABASE_SQL_LOGGING === 'true',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
//  port: parseInt(process.env.DATABASE_PORT, 10),
//  entities: [__dirname + '/../src/**/*.entity.{ts,js}'],
  migrationsTableName: 'migrations',
  migrations: ['./migrations/*.ts'],
});
