import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Role } from '../enum/role.enum';
import { ConfigService } from '@nestjs/config';

describe('UserService', () => {
  let userService: UserService;
  let saveMock: jest.Mock;
  let findMock: jest.Mock;
  let findOneMock: jest.Mock;
  let updateMock: jest.Mock;
  let removeMock: jest.Mock;

  const user = {
    username: 'username',
    password: 'password',
    roles: [Role.Admin],
  };
  const databaseUser: User = {
    ...user,
    id: 1,
  };

  beforeEach(async () => {
    saveMock = jest.fn();
    findMock = jest.fn();
    findOneMock = jest.fn();
    updateMock = jest.fn();
    removeMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: saveMock,
            find: findMock,
            findOne: findOneMock,
            update: updateMock,
            remove: removeMock,
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should call create method with expected params', async () => {
    const createUserSpy = jest.spyOn(userService, 'create');
    saveMock.mockResolvedValue(databaseUser);
    const newUser = await userService.create(user);
    return Promise.all([
      expect(createUserSpy).toHaveBeenCalledWith(user),
      expect(newUser.username).toStrictEqual('username'),
      expect(newUser.roles).toStrictEqual(['admin']),
    ]);
  });

  it('should call findOne method with expected param', async () => {
    const findOneSpy = jest.spyOn(userService, 'findOne');
    findOneMock.mockResolvedValue(databaseUser);
    const username = 'username';
    const user = await userService.findOne(username);
    return Promise.all([
      expect(findOneSpy).toHaveBeenCalledWith(username),
      expect(user.username).toStrictEqual('username'),
      expect(user.roles).toStrictEqual(['admin']),
    ]);
  });

  it('should call update method with expected params', async () => {
    const newRole = { roles: [Role.User] };
    const updateSpy = jest.spyOn(userService, 'update');
    updateMock.mockResolvedValue({ ...databaseUser, ...newRole });
    findOneMock.mockResolvedValue({ ...databaseUser, ...newRole });
    const updateUser = { ...user, roles: newRole.roles };
    const username = 'username';
    const updatedUser = await userService.update(username, updateUser);
    return Promise.all([
      expect(updateSpy).toHaveBeenCalledWith(username, updateUser),
      expect(updatedUser.username).toStrictEqual('username'),
      expect(updatedUser.roles).toStrictEqual(['user']),
    ]);
  });

  it('should call remove method with expected param', async () => {
    const removeSpy = jest.spyOn(userService, 'remove');
    findOneMock.mockResolvedValue(databaseUser);
    const username = 'username';
    userService.remove(username);
    return Promise.all([expect(removeSpy).toHaveBeenCalledWith(username)]);
  });

  it('should throw error when try to remove non-existent user', async () => {
    const removeSpy = jest.spyOn(userService, 'remove');
    findOneMock.mockResolvedValue(undefined);
    const username = 'username';
    const result = userService.remove(username);
    return Promise.all([
      expect(removeSpy).toHaveBeenCalledWith(username),
      expect(result).rejects.toThrow(HttpException),
      expect(result).rejects.toThrow('User not found'),
    ]);
  });

  it('should call findAll method with expected param', async () => {
    const findAllSpy = jest.spyOn(userService, 'findAll');
    findMock.mockResolvedValue([databaseUser]);
    const page = 1;
    const User = await userService.findAll(page);
    return Promise.all([
      expect(findAllSpy).toHaveBeenCalledWith(page),
      expect(User).toBeInstanceOf(Array),
      expect(User).toStrictEqual([databaseUser]),
    ]);
  });
});
