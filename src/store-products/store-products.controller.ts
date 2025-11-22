import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { StoreProductsService } from './store-products.service';
import { AddStoreProductDto } from './dto/add-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('store-products')
@Controller('stores/:storeId/products')
export class StoreProductsController {
  constructor(private readonly storeProductsService: StoreProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a product to a store' })
  addProduct(
    @Param('storeId') storeId: string,
    @Body() dto: AddStoreProductDto,
  ) {
    return this.storeProductsService.addProductToStore(storeId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List products of a store' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'q', required: false, description: 'Search term for product name/description' })
  @ApiQuery({ name: 'inStock', required: false, description: 'Filter products with stock > 0' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update price/stock of a store product' })
  update(
    @Param('storeId') storeId: string,
    @Param('storeProductId') storeProductId: string,
    @Body() dto: UpdateStoreProductDto,
  ) {
    return this.storeProductsService.updateStoreProduct(storeId, storeProductId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':storeProductId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a product from a store' })
  remove(
    @Param('storeId') storeId: string,
    @Param('storeProductId') storeProductId: string,
  ) {
    return this.storeProductsService.removeStoreProduct(storeId, storeProductId);
  }
}
