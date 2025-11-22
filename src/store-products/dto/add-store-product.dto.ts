import { IsNotEmpty, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddStoreProductDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 10.5 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(0)
  stock: number;
}
