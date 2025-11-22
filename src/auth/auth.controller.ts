import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import type { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ description: 'User created and JWT token returned' })
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password, dto.displayName);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Returns JWT access token and user data' })
  async login(@Body() _dto: LoginDto, @Req() req: Request) {
    // @ts-ignore
    return this.auth.login(req.user);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  async profile(@Req() req: Request) {
    return req.user;
  }
}
