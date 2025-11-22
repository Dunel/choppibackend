import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from './user.entity';
import { StoreProduct } from './store-product.entity';

@Entity({ name: 'stores' })
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  
  @Column({ nullable: true })
  address?: string;

  @ManyToOne(() => User, user => user.stores, { onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => StoreProduct, sp => sp.store)
  storeProducts: StoreProduct[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;
}
