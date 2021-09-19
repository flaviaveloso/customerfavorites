import { IsDecimal } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn()
  id: string;
  @Column()
  @IsDecimal()
  price: number;
  @Column()
  image: string;
  @Column()
  title: string;
  @Column({ nullable: true })
  @IsDecimal()
  reviewScore: number;
  @Column()
  brand: string;
}
