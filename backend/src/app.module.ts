import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AccountingModule } from './accounting/accounting.module';

const dbConfig: TypeOrmModuleOptions =
  process.env.DB_TYPE === 'postgres'
    ? {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        ssl: { rejectUnauthorized: false },
        autoLoadEntities: true,
        synchronize: true,
      }
    : {
        type: 'sqlite',
        database: process.env.DB_DATABASE || 'molido-accounting.sqlite',
        autoLoadEntities: true,
        synchronize: true,
      };

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), AccountingModule],
})
export class AppModule {}
