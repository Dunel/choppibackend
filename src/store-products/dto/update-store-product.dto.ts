import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStoreProductDto {
  @ApiPropertyOptional({ example: 12.0 })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;
}
