import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemInputDto } from './quote-item.dto';

export class QuoteCartDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CartItemInputDto)
  items: CartItemInputDto[];
}
