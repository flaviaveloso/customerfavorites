import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Roles } from './decorator/roles.decorator';
import { SkipAuth } from './decorator/skipAuth.decorator';
import { Role } from './enum/role.enum';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Roles(Role.Admin)
  @Get('/healthcheck')
  healthcheck(): string {
    return this.appService.healthcheck();
  }

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
