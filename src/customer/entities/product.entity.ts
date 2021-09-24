import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'double' })
  price: number;

  @Column()
  image: string;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'double' })
  reviewScore: number;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
