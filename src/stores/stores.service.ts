import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) private readonly repo: Repository<Store>,
  ) {}

  async findAll(page = 1, limit = 10, q?: string) {
    const safePage = page && page > 0 ? page : 1;
    const safeLimit = limit && limit > 0 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;
    const query = this.repo
      .createQueryBuilder('store')
      .where('store.deletedAt IS NULL');

    if (q) {
      query.andWhere(
        '(unaccent(store.name) ILIKE unaccent(:q) OR unaccent(store.address) ILIKE unaccent(:q))',
        { q: `%${q}%` },
      );
    }

    query.orderBy('store.createdAt', 'DESC').skip(skip).take(safeLimit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: { page: safePage, limit: safeLimit, total },
    };
  }

  async findOne(id: string) {
    const store = await this.repo.findOne({ where: { id } });
    if (store?.deletedAt) throw new NotFoundException('Store not found');
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async create(dto: CreateStoreDto, owner: User) {
    const store = this.repo.create({
      name: dto.name,
      address: dto.address,
      owner,
    });
    return this.repo.save(store);
  }

  async update(id: string, dto: UpdateStoreDto) {
    const store = await this.findOne(id);
    Object.assign(store, dto);
    return this.repo.save(store);
  }

  async softDelete(id: string) {
    const store = await this.findOne(id);
    await this.repo.softRemove(store);
  }
}
