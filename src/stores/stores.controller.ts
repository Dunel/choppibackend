import { Controller, Get, Query, Param, ParseIntPipe, DefaultValuePipe, Post, Body, UseGuards, Req, Put, Delete, ParseBoolPipe } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly stores: StoresService) {}

  @Get()
  @ApiOperation({ summary: 'List stores with pagination and search' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (>= 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (>= 1)', example: 10 })
  @ApiQuery({ name: 'q', required: false, description: 'Search by name or address' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('q') q?: string,
  ) {
    if (page < 1 || limit < 1) {
      // ValidationPipe will turn this into a 400 response
      throw new Error('page and limit must be greater than or equal to 1');
    }
    return this.stores.findAll(page, limit, q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by id' })
  async findOne(@Param('id') id: string) {
    return this.stores.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new store' })
  async create(@Body() dto: CreateStoreDto, @Req() req: Request) {
    const user = req.user as any;
    return this.stores.create(dto, { id: user.userId } as any);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a store' })
  async update(@Param('id') id: string, @Body() dto: UpdateStoreDto) {
    return this.stores.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a store' })
  async remove(@Param('id') id: string) {
    await this.stores.softDelete(id);
    return { success: true };
  }
}
