import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async findAll(page: number): Promise<User[]> {
    if (page === 0) {
      throw new HttpException(`Page ${page} not found`, HttpStatus.NOT_FOUND);
    }

    const pageSize = 2;
    return this.usersRepository.find({
      skip: pageSize * (page - 1),
      take: pageSize,
    });
  }

  async findOne(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
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

  async update(username: string, user: any): Promise<any> {
    return this.usersRepository.update(username, user);
  }

  async remove(username: string): Promise<any> {
    return this.usersRepository.delete(username);
  }
}
