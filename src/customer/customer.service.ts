import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import * as axios from 'axios';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
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

  findAll(): Promise<Customer[]> {
    return this.customersRepository.find({ relations: ['favorites'] });
  }

  findOne(id: number): Promise<Customer> {
    return this.customersRepository.findOne(id, { relations: ['favorites'] });
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    return this.customersRepository.update(id, updateCustomerDto).then(() => {
      return this.customersRepository.findOne(id, { relations: ['favorites'] });
    });
  }

  remove(id: number): Promise<Customer> {
    return this.customersRepository.findOne(id).then((customer) => {
      return this.customersRepository.remove(customer);
    });
  }

  addProductToFavorites(id: number, productId: string): Promise<Customer> {
    return axios.default
      .get(`http://challenge-api.luizalabs.com/api/product/${productId}/`)
      .then(async (product) => {
        const customer = await this.customersRepository.findOne(id, {
          relations: ['favorites'],
        });

        customer.setFavorite(product.data);
        this.customersRepository.save(customer);

        return product.data;
      })
      .catch((err) => {
        if (err.response.data.code === 'not_found') {
          throw new HttpException(
            `Product ${productId} not found`,
            HttpStatus.NOT_FOUND,
          );
        }
      });
  }

  async removeProductFromFavorites(
    id: number,
    productId: string,
  ): Promise<Customer> {
    const customer = await this.customersRepository.findOne(id, {
      relations: ['favorites'],
    });

    customer.favorites = customer.favorites.filter((favoriteProduct) => {
      return favoriteProduct.id !== productId;
    });

    return this.customersRepository.save(customer);
  }
}
