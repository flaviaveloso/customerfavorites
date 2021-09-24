import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Roles } from '../decorator/roles.decorator';
import { Role } from '../enum/role.enum';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { Product } from './entities/product.entity';

@Controller({
  version: '1',
})
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Roles(Role.Admin, Role.User)
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerService.create(createCustomerDto);
  }

  @Roles(Role.Admin, Role.User)
  @Post(':id/product')
  favoriteProduct(
    @Param('id') id: string,
    @Body('productId') productId: string,
  ): Promise<any> {
    return this.customerService.addProductToFavorites(Number(id), productId);
  }

  @Roles(Role.Admin, Role.User)
  @Get()
  findAll(@Query('page') page = '1'): Promise<Customer[]> {
    return this.customerService.findAll(Number(page));
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customerService.findOne(Number(id));
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id/product')
  findFavoritesProducts(@Param('id') id: string): Promise<Product[]> {
    return this.customerService.findProducts(Number(id));
  }

  @Roles(Role.Admin, Role.User)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.update(Number(id), updateCustomerDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Customer> {
    return this.customerService.remove(Number(id));
  }

  @Roles(Role.Admin, Role.User)
  @Delete(':id/product/:productId')
  removeFavoriteProduct(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ): Promise<any> {
    return this.customerService.removeProductFromFavorites(
      Number(id),
      productId,
    );
  }
}
