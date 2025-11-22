import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { StoreProduct } from '../entities/store-product.entity';
import { Store } from '../entities/store.entity';
import { Product } from '../entities/product.entity';
import { AddStoreProductDto } from './dto/add-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';

@Injectable()
export class StoreProductsService {
  constructor(
    @InjectRepository(StoreProduct)
    private readonly storeProductRepo: Repository<StoreProduct>,
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async addProductToStore(storeId: string, dto: AddStoreProductDto) {
    const store = await this.storeRepo.findOne({ where: { id: storeId } });
    if (!store || store.deletedAt) throw new NotFoundException('Store not found');

    const product = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.storeProductRepo.findOne({
      where: { store: { id: store.id }, product: { id: product.id } },
      relations: ['store', 'product'],
    });
    if (existing) {
      throw new BadRequestException('Product is already added to this store');
    }

    const sp = this.storeProductRepo.create({
      store,
      product,
      price: dto.price.toString(),
      stock: dto.stock,
    });
    return this.storeProductRepo.save(sp);
  }

  async listStoreProducts(
    storeId: string,
    page = 1,
    limit = 10,
    q?: string,
    inStock?: boolean,
  ) {
    const store = await this.storeRepo.findOne({ where: { id: storeId } });
    if (!store || store.deletedAt) throw new NotFoundException('Store not found');

    const skip = (page - 1) * limit;

    const where: any = { store: { id: storeId } };

    if (inStock) {
      where.stock = { $gt: 0 } as any;
    }

    const query = this.storeProductRepo
      .createQueryBuilder('sp')
      .leftJoinAndSelect('sp.product', 'product')
      .where('sp.storeId = :storeId', { storeId });

    if (inStock) {
      query.andWhere('sp.stock > 0');
    }

    if (q) {
      query.andWhere('product.name ILIKE :q OR product.description ILIKE :q', {
        q: `%${q}%`,
      });
    }

    query.skip(skip).take(limit).orderBy('product.name', 'ASC');

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: { page, limit, total },
    };
  }

  async updateStoreProduct(storeId: string, storeProductId: string, dto: UpdateStoreProductDto) {
    const sp = await this.storeProductRepo.findOne({
      where: { id: storeProductId, store: { id: storeId } },
      relations: ['store', 'product'],
    });
    if (!sp) throw new NotFoundException('Store product not found');

    if (dto.price !== undefined) {
      sp.price = dto.price.toString();
    }
    if (dto.stock !== undefined) {
      sp.stock = dto.stock;
    }
    return this.storeProductRepo.save(sp);
  }

  async removeStoreProduct(storeId: string, storeProductId: string) {
    const sp = await this.storeProductRepo.findOne({
      where: { id: storeProductId, store: { id: storeId } },
    });
    if (!sp) throw new NotFoundException('Store product not found');
    await this.storeProductRepo.remove(sp);
  }
}
