import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(email: string, password: string, _displayName?: string): Promise<User> {
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new Error('Email already registered');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = this.repo.create({ email, password: hashed });
    return this.repo.save(user);
  }

  sanitize(user: User) {
    const { password, ...rest } = user;
    return rest;
  }
}
