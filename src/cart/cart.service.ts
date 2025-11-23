import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StoreProduct } from '../entities/store-product.entity';
import { QuoteCartDto } from './dto/quote-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(StoreProduct)
    private readonly storeProductRepo: Repository<StoreProduct>,
  ) {}

  async quote(dto: QuoteCartDto) {
    const ids = dto.items.map(item => item.storeProductId);
    const storeProducts = await this.storeProductRepo.find({
      where: { id: In(ids) },
      relations: ['product', 'store'],
    });

    const storeProductMap = new Map(storeProducts.map(sp => [sp.id, sp]));

    const items = dto.items.map(({ storeProductId, quantity }) => {
      const sp = storeProductMap.get(storeProductId);
      if (!sp) {
        throw new NotFoundException(`Store product ${storeProductId} not found`);
      }

      const unitPrice = Number(sp.price);
      const subtotal = Number((unitPrice * quantity).toFixed(2));

      return {
        storeProductId,
        quantity,
        unitPrice,
        subtotal,
        product: {
          id: sp.product?.id,
          name: sp.product?.name,
        },
        store: {
          id: sp.store?.id,
          name: sp.store?.name,
        },
      };
    });

    const total = Number(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));

    return { items, total };
  }
}
