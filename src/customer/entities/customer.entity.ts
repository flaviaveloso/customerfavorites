import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateCustomerDto } from '../dto/create-customer.dto';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  constructor(createCustomerDto: CreateCustomerDto) {
    this.name = createCustomerDto?.name;
    this.email = createCustomerDto?.email;
  }
}
