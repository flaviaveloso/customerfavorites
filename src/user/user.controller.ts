import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  CacheInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '../decorator/roles.decorator';
import { SkipAuth } from '../decorator/skipAuth.decorator';
import { Role } from '../enum/role.enum';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller({
  version: '1',
})
@UseInterceptors(CacheInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @SkipAuth()
  @Post()
  create(@Body() createUserDto: any): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Roles(Role.Admin, Role.User)
  @Get()
  findAll(@Query('page') page = '1'): Promise<User[]> {
    return this.userService.findAll(Number(page));
  }

  @Roles(Role.Admin, Role.User)
  @Get(':username')
  findOne(@Param('username') username: string): Promise<User> {
    return this.userService.findOne(username);
  }

  @Roles(Role.Admin, Role.User)
  @Patch(':username')
  update(
    @Param('username') username: string,
    @Body() updateUserDto: any,
  ): Promise<any> {
    return this.userService.update(username, updateUserDto);
  }

  @Roles(Role.Admin)
  @Delete(':username')
  remove(@Param('username') username: string): Promise<any> {
    return this.userService.remove(username);
  }
}
