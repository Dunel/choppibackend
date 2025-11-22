import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreProduct } from '../entities/store-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreProduct])],
})
export class StoreProductsModule {}
