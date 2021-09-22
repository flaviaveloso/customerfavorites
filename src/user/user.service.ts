import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOneById(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async create(user: any): Promise<User> {
    const saltRounds = 10;
    return bcrypt.hash(user.password, saltRounds).then((result) => {
      user.password = result;
      return this.usersRepository.save(user).then((updatedUser) => {
        Reflect.deleteProperty(updatedUser, 'password');
        return updatedUser;
      });
    });
  }

  async update(id: number, user: any): Promise<any> {
    return this.usersRepository.update(id, user);
  }

  async remove(id: number): Promise<any> {
    return this.usersRepository.delete(id);
  }
}
