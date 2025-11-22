import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class UpdateStoreProductDto {
  @IsNumber()
  @IsOptional()
  @IsPositive()
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;
}
