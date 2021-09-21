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
import { SkipAuth } from '../custom/skipAuth.decorator';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { Product } from './entities/product.entity';

@Controller({
  version: '1',
})
@UseInterceptors(CacheInterceptor)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @SkipAuth()
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerService.create(createCustomerDto);
  }

  @Post(':id/product')
  favoriteProduct(
    @Param('id') id: string,
    @Body('productId') productId: string,
  ): Promise<any> {
    return this.customerService.addProductToFavorites(Number(id), productId);
  }

  @Get()
  findAll(@Query('page') page = '1'): Promise<Customer[]> {
    return this.customerService.findAll(Number(page));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customerService.findOne(Number(id));
  }

  @Get(':id/product')
  findFavoritesProducts(@Param('id') id: string): Promise<Product[]> {
    return this.customerService.findProducts(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.update(Number(id), updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Customer> {
    return this.customerService.remove(Number(id));
  }

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
