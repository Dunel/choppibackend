import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Store } from './entities/store.entity';
import { Product } from './entities/product.entity';
import { StoreProduct } from './entities/store-product.entity';
import { StoresModule } from './stores/stores.module';
import { ProductsModule } from './products/products.module';
import { StoreProductsModule } from './store-products/store-products.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      autoLoadEntities: false,
      entities: [User, Store, Product, StoreProduct],
    }),
    UserModule,
    AuthModule,
    StoresModule,
    ProductsModule,
    StoreProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
