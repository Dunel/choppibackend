import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { StoreProductsService } from './store-products.service';
import { AddStoreProductDto } from './dto/add-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stores/:storeId/products')
export class StoreProductsController {
  constructor(private readonly storeProductsService: StoreProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  addProduct(
    @Param('storeId') storeId: string,
    @Body() dto: AddStoreProductDto,
  ) {
    return this.storeProductsService.addProductToStore(storeId, dto);
  }

  @Get()
  list(
    @Param('storeId') storeId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('q') q?: string,
    @Query('inStock') inStock?: string,
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const inStockBool = inStock === 'true';
    return this.storeProductsService.listStoreProducts(storeId, pageNum, limitNum, q, inStockBool);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':storeProductId')
  update(
    @Param('storeId') storeId: string,
    @Param('storeProductId') storeProductId: string,
    @Body() dto: UpdateStoreProductDto,
  ) {
    return this.storeProductsService.updateStoreProduct(storeId, storeProductId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':storeProductId')
  remove(
    @Param('storeId') storeId: string,
    @Param('storeProductId') storeProductId: string,
  ) {
    return this.storeProductsService.removeStoreProduct(storeId, storeProductId);
  }
}
