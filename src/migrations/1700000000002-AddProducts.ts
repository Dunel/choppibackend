import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProducts1700000000002 implements MigrationInterface {
  name = 'AddProducts1700000000002';

  private readonly storeNames = ['Central Market', 'North Shop', 'Downtown Store'];

  private readonly products = [
    { name: 'Harina PAN Blanca 1kg', description: 'Harina de maíz precocida blanca', price: 2.5, stock: 150 },
    { name: 'Harina PAN Amarilla 1kg', description: 'Harina de maíz precocida amarilla', price: 2.4, stock: 140 },
    { name: 'Arroz Mary Tradicional 1kg', description: 'Arroz blanco marca Mary', price: 1.2, stock: 180 },
    { name: 'Arroz Mary Integral 1kg', description: 'Arroz integral marca Mary', price: 1.4, stock: 160 },
    { name: 'Café Fama de América 500g', description: 'Café molido venezolano', price: 4.8, stock: 80 },
    { name: 'Café Venezuela 500g', description: 'Café tostado y molido', price: 4.5, stock: 75 },
    { name: 'Aceite Diana 900ml', description: 'Aceite vegetal marca Diana', price: 3.1, stock: 90 },
    { name: 'Mayonesa Mavesa 445g', description: 'Mayonesa venezolana tradicional', price: 3.4, stock: 85 },
    { name: 'Margarina Mavesa 500g', description: 'Margarina untable', price: 2.9, stock: 95 },
    { name: 'Chocolate Savoy 130g', description: 'Chocolate con leche Savoy', price: 2.2, stock: 120 },
    { name: 'Galletas María Puig 250g', description: 'Galletas dulces tradicionales', price: 1.5, stock: 150 },
    { name: 'Cereal Flips 300g', description: 'Cereal de chocolate', price: 4.2, stock: 70 },
    { name: 'Maltín Polar 355ml', description: 'Malta sin alcohol', price: 1.5, stock: 140 },
    { name: 'Coca-Cola 2L', description: 'Refresco cola internacional', price: 2.0, stock: 200 },
    { name: 'Frescolita 1.5L', description: 'Refresco tradicional venezolano', price: 1.9, stock: 110 },
    { name: 'Agua Minalba 1.5L', description: 'Agua mineral venezolana', price: 1.0, stock: 160 },
    { name: 'Atún Eveba 170g', description: 'Atún en lata', price: 2.3, stock: 100 },
    { name: 'Sardinas Margarita 155g', description: 'Sardinas en salsa de tomate', price: 2.0, stock: 90 },
    { name: 'Azúcar Montalbán 1kg', description: 'Azúcar refinada venezolana', price: 1.3, stock: 170 },
    { name: 'Pasta Primor 500g', description: 'Pasta de sémola Primor', price: 1.7, stock: 160 },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    const values = this.products
      .map(
        ({ name, description }) =>
          ` (uuid_generate_v4(), '${name.replace(/'/g, "''")}', '${description.replace(/'/g, "''")}', NOW())`,
      )
      .join(',');

    await queryRunner.query(
      `INSERT INTO "products" ("id", "name", "description", "created_at") VALUES${values}`,
    );

    const storeProductValues: string[] = [];
    this.storeNames.forEach((store, storeIdx) => {
      this.products.forEach(({ name, price, stock }) => {
        const adjustedPrice = (price + storeIdx * 0.1).toFixed(2);
        const adjustedStock = Math.max(stock - storeIdx * 5, 10);
        storeProductValues.push(
          `('${store.replace(/'/g, "''")}', '${name.replace(/'/g, "''")}', ${adjustedPrice}, ${adjustedStock})`,
        );
      });
    });

    await queryRunner.query(
      `INSERT INTO "store_products" ("id", "storeId", "productId", "price", "stock")
       SELECT uuid_generate_v4(), s.id, p.id, sp.price, sp.stock
       FROM (VALUES ${storeProductValues.join(',')}) AS sp(store_name, product_name, price, stock)
       JOIN stores s ON s.name = sp.store_name
       JOIN products p ON p.name = sp.product_name`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const storeProductConditions = this.storeNames
      .flatMap((store) =>
        this.products.map(({ name }) =>
          `(s.name = '${store.replace(/'/g, "''")}' AND p.name = '${name.replace(/'/g, "''")}')`,
        ),
      )
      .join(' OR ');

    await queryRunner.query(
      `DELETE FROM "store_products" WHERE "id" IN (
        SELECT sp.id FROM store_products sp
        JOIN stores s ON s.id = sp."storeId"
        JOIN products p ON p.id = sp."productId"
        WHERE ${storeProductConditions}
      )`,
    );

    const names = this.products.map(({ name }) => `'${name.replace(/'/g, "''")}'`).join(',');
    await queryRunner.query(`DELETE FROM "products" WHERE "name" IN (${names})`);
  }
}
