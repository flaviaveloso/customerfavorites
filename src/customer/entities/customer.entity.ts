import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { Product } from './product.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable()
  favorites: Product[];

  constructor(createCustomerDto: CreateCustomerDto) {
    this.name = createCustomerDto?.name;
    this.email = createCustomerDto?.email;
  }

  setFavorite(product: Product) {
    this.favorites.push(product);
  }
}
