import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

   @ApiProperty({ minLength: 6, example: 'secret123' })
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ description: 'Display name of the user' })
  @IsOptional()
  @IsNotEmpty()
  displayName?: string;
}
