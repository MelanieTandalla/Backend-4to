import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './databse.providers';
import { DatabaseSeeder } from '../seeds/database-seeder';


@Global()
@Module({
  providers: [
    ...databaseProviders,
    DatabaseSeeder,
    CategorySeeder,
    ProductSeeder,
  ],
  exports: [...databaseProviders, DatabaseSeeder],
})
export class DatabaseModule {}