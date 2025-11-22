import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreProduct } from '../entities/store-product.entity';
import { Store } from '../entities/store.entity';
import { Product } from '../entities/product.entity';
import { StoreProductsService } from './store-products.service';
import { StoreProductsController } from './store-products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StoreProduct, Store, Product])],
  providers: [StoreProductsService],
  controllers: [StoreProductsController],
})
export class StoreProductsModule {}
