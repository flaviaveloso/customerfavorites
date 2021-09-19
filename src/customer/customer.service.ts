import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

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
              400,
            );
          }
        }

        throw err;
      });
  }

  findAll(): Promise<Customer[]> {
    return this.customersRepository.find();
  }

  findOne(id: number): Promise<Customer> {
    return this.customersRepository.findOne(id);
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    return this.customersRepository.update(id, updateCustomerDto).then(() => {
      return this.customersRepository.findOne(id);
    });
  }

  remove(id: number): Promise<Customer> {
    return this.customersRepository.findOne(id).then((customer) => {
      return this.customersRepository.remove(customer);
    });
  }
}
