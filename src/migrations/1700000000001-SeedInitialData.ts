import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class SeedInitialData1700000000001 implements MigrationInterface {
  name = 'SeedInitialData1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create demo user
    const passwordHash = await bcrypt.hash('demo123', 10);
    await queryRunner.query(
      `INSERT INTO "users" ("id", "email", "password", "created_at") VALUES
       (uuid_generate_v4(), 'test@gmail.com', $1, NOW())`,
      [passwordHash],
    );

    // Create example stores
    await queryRunner.query(
      `INSERT INTO "stores" ("id", "name", "address", "created_at") VALUES
       (uuid_generate_v4(), 'Central Market', 'Main St 123', NOW()),
       (uuid_generate_v4(), 'North Shop', 'North Ave 45', NOW()),
       (uuid_generate_v4(), 'Downtown Store', 'Downtown 9', NOW())`,
    );

    // Create example products
    await queryRunner.query(
      `INSERT INTO "products" ("id", "name", "description", "created_at") VALUES
       (uuid_generate_v4(), 'Beer Lager 1L', 'Classic lager beer', NOW()),
       (uuid_generate_v4(), 'Beer IPA 500ml', 'Hoppy IPA', NOW()),
       (uuid_generate_v4(), 'Soda Cola 2L', 'Cola flavored soda', NOW()),
       (uuid_generate_v4(), 'Soda Orange 500ml', 'Orange soda', NOW()),
       (uuid_generate_v4(), 'Chips Classic', 'Salted potato chips', NOW()),
       (uuid_generate_v4(), 'Chips Barbecue', 'BBQ flavored chips', NOW()),
       (uuid_generate_v4(), 'Water 1.5L', 'Mineral water', NOW()),
       (uuid_generate_v4(), 'Energy Drink 250ml', 'Energy drink', NOW()),
       (uuid_generate_v4(), 'Wine Red 750ml', 'Red wine', NOW()),
       (uuid_generate_v4(), 'Wine White 750ml', 'White wine', NOW())`,
    );

    await queryRunner.query(
      `INSERT INTO "store_products" ("id", "storeId", "productId", "price", "stock")
       SELECT uuid_generate_v4(), s.id, p.id, sp.price, sp.stock
       FROM (
         VALUES
           ('Central Market', 'Beer Lager 1L', 1.99, 50),
           ('Central Market', 'Soda Cola 2L', 1.49, 80),
           ('Central Market', 'Chips Classic', 0.99, 100),
           ('North Shop', 'Beer IPA 500ml', 2.49, 40),
           ('North Shop', 'Water 1.5L', 0.79, 120),
           ('Downtown Store', 'Energy Drink 250ml', 1.89, 60),
           ('Downtown Store', 'Wine Red 750ml', 5.99, 25),
           ('Downtown Store', 'Wine White 750ml', 5.49, 20)
       ) AS sp(store_name, product_name, price, stock)
       JOIN stores s ON s.name = sp.store_name
       JOIN products p ON p.name = sp.product_name`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete associations
    await queryRunner.query(
      `DELETE FROM "store_products" WHERE "id" IN (
        SELECT sp.id FROM store_products sp
        JOIN stores s ON s.id = sp."storeId"
        JOIN products p ON p.id = sp."productId"
        WHERE s.name IN ('Central Market', 'North Shop', 'Downtown Store')
          AND p.name IN (
            'Beer Lager 1L','Beer IPA 500ml','Soda Cola 2L','Chips Classic',
            'Water 1.5L','Energy Drink 250ml','Wine Red 750ml','Wine White 750ml'
          )
      )`,
    );

    // Delete products
    await queryRunner.query(
      `DELETE FROM "products" WHERE "name" IN (
        'Beer Lager 1L','Beer IPA 500ml','Soda Cola 2L','Soda Orange 500ml',
        'Chips Classic','Chips Barbecue','Water 1.5L','Energy Drink 250ml',
        'Wine Red 750ml','Wine White 750ml'
      )`,
    );

    // Delete stores
    await queryRunner.query(
      `DELETE FROM "stores" WHERE "name" IN ('Central Market','North Shop','Downtown Store')`,
    );

    // Delete demo user
    await queryRunner.query(
      `DELETE FROM "users" WHERE "email" = 'test@gmail.com'`,
    );
  }
}
