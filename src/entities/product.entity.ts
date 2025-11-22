import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { StoreProduct } from './store-product.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  name: string;


  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => StoreProduct, sp => sp.product)
  storeProducts: StoreProduct[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
