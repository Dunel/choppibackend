import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique } from 'typeorm';
import { Store } from './store.entity';
import { Product } from './product.entity';

@Entity({ name: 'store_products' })
@Unique(['store', 'product'])
export class StoreProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Store, store => store.storeProducts, { onDelete: 'CASCADE' })
  store: Store;

  @ManyToOne(() => Product, product => product.storeProducts, { onDelete: 'CASCADE' })
  product: Product;

  @Column('decimal', { precision: 10, scale: 2 })
  price: string;

  @Column('int', { default: 0 })
  stock: number;
}
