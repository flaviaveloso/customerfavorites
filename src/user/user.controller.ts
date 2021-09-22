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
    return this.userService.findAll();
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOneById(Number(id));
  }

  @Roles(Role.Admin, Role.User)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any): Promise<any> {
    return this.userService.update(Number(id), updateUserDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<any> {
    return this.userService.remove(Number(id));
  }
}
