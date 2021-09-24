import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import * as axios from 'axios';
import { Product } from './entities/product.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private configService: ConfigService,
  ) {}

  create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customersRepository
      .save(new Customer(createCustomerDto))
      .catch((err) => {
        if (err instanceof QueryFailedError) {
          if (err.driverError.code === 'ER_DUP_ENTRY') {
            throw new HttpException(
              'This email address is already being used.',
              HttpStatus.CONFLICT,
            );
          }
        }

        throw err;
      });
  }

  findAll(page: number): Promise<Customer[]> {
    if (page < 1) {
      throw new HttpException(`Page ${page} not found`, HttpStatus.NOT_FOUND);
    }

    const pageSize = this.configService.get('PAGINATION_SIZE');
    return this.customersRepository.find({
      relations: ['favorites'],
      skip: pageSize * (page - 1),
      take: pageSize,
    });
  }

  findOne(id: number): Promise<Customer> {
    return this.customersRepository
      .findOne(id, {
        relations: ['favorites'],
      })
      .then((customer) => {
        customer.favorites.forEach((favoriteProduct) => {
          if (!favoriteProduct.reviewScore)
            Reflect.deleteProperty(favoriteProduct, 'reviewScore');
        });
        return customer;
      });
  }

  async findProducts(id: number): Promise<Product[]> {
    const result = await this.findOne(id);
    return result.favorites;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    return this.customersRepository.update(id, updateCustomerDto).then(() => {
      return this.customersRepository.findOne(id, { relations: ['favorites'] });
    });
  }

  async remove(id: number): Promise<Customer> {
    const customer = await this.customersRepository.findOne(id);
    if (customer) return this.customersRepository.remove(customer);

    throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
  }

  async addProductToFavorites(
    id: number,
    productId: string,
  ): Promise<Customer> {
    try {
      const promises = await Promise.all([
        this.productsRepository.findOne(productId),
        this.customersRepository.findOne(id, {
          relations: ['favorites'],
        }),
      ]);

      const databaseProduct = promises[0];
      const customer = promises[1];

      const exists = customer.favorites.some(
        (favoriteProduct) => favoriteProduct.id === productId,
      );

      if (exists) {
        throw new HttpException(
          `Product already in customer favorites list`,
          HttpStatus.CONFLICT,
        );
      }

      if (new Date(Date.now() - 5000 * 60) < databaseProduct?.updatedAt) {
        customer.setFavorite(databaseProduct);
      } else {
        const response = await axios.default.get(
          `http://challenge-api.luizalabs.com/api/product/${productId}/`,
        );

        customer.setFavorite({ ...response.data, updatedAt: new Date() });
      }

      return this.customersRepository.save(customer);
    } catch (err) {
      if (err.isAxiosError && err.response.data.code === 'not_found') {
        throw new HttpException(
          `Product ${productId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      throw err;
    }
  }

  async removeProductFromFavorites(
    id: number,
    productId: string,
  ): Promise<Customer> {
    const customer = await this.customersRepository.findOne(id, {
      relations: ['favorites'],
    });

    customer.favorites = customer.favorites.filter((favoriteProduct) => {
      favoriteProduct.id !== productId;
    });

    return this.customersRepository.save(customer);
  }
}
