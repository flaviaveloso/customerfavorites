import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async findAll(page: number): Promise<User[]> {
    if (page < 1) {
      throw new HttpException(`Page ${page} not found`, HttpStatus.NOT_FOUND);
    }

    const pageSize = this.configService.get('PAGINATION_SIZE');
    return this.usersRepository
      .find({
        skip: pageSize * (page - 1),
        take: pageSize,
      })
      .then((users) => {
        return users.map((user) => {
          Reflect.deleteProperty(user, 'password');
          return user;
        });
      });
  }

  async findOne(username: string): Promise<User> {
    return this.usersRepository
      .findOne({ where: { username } })
      .then((user) => {
        Reflect.deleteProperty(user, 'password');
        return user;
      });
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
    return this.usersRepository.update(username, user).then(() => {
      return this.usersRepository.findOne(username);
    });
  }

  async remove(username: string): Promise<any> {
    const user = await this.usersRepository.findOne(username);
    if (user) return this.usersRepository.remove(user);

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
