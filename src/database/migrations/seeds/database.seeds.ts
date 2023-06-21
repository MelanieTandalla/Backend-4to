import { Injectable } from '@nestjs/common';
import { CataloguesSeeder } from './catalogues-seeder';
import { UsersSeeder } from './users-seeder';
import { RolesSeeder } from './roles-seeder';
import { MenusSeeder } from './menus-seeder';

@Injectable()
export class DatabaseSeeder {
  constructor(
    private categorySeeder: CategorySeeder,
    private productSeeder: ProductSeeder,

  ) {}

  async run() {
    await this.categorySeeder.run();
    await this.productSeeder.run();

  }
}