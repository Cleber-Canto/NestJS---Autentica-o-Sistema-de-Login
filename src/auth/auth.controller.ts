/* eslint-disable prettier/prettier */
import { AuthService } from './auth.service';
import { Controller, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IsPublic } from './decorators/is-public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    console.log(req.user);
    return this.authService.login(req.user);
    
  }
}
