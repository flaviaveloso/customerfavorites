import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../enum/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  roles: Role[];
}
