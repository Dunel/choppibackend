import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { StoreProduct } from '../entities/store-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreProduct])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
