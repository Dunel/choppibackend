import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({ maxLength: 255, example: 'Central Market' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ maxLength: 255, example: 'Main St 123' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;
}
