import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { QuoteCartDto } from './dto/quote-cart.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('quote')
  @ApiOperation({ summary: 'Quote cart subtotal without creating an order' })
  quoteCart(@Body() dto: QuoteCartDto) {
    return this.cartService.quote(dto);
  }
}
