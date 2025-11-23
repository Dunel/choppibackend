import { IsInt, IsPositive, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemInputDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  storeProductId: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @IsPositive()
  quantity: number;
}
