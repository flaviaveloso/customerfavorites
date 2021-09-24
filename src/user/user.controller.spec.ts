import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('userController', () => {
  let userController: UserController;
  let userServiceMock: UserService;

  const user = { username: 'username', password: 'password', rules: ['admin'] };

  beforeEach(async () => {
    const ServiceProviderMock = {
      provide: UserService,
      useFactory: () => ({
        create: jest.fn(() => []),
        findAll: jest.fn(() => []),
        findOne: jest.fn(() => {
          return;
        }),
        update: jest.fn(() => {
          return;
        }),
        remove: jest.fn(() => {
          return;
        }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, ServiceProviderMock],
    }).compile();

    userController = module.get<UserController>(UserController);
    userServiceMock = module.get<UserService>(UserService);
  });

  it('calling create method', () => {
    userController.create(user);
    expect(userServiceMock.create).toHaveBeenCalled();
    expect(userServiceMock.create).toHaveBeenCalledWith(user);
  });

  it('calling findall method', () => {
    userController.findAll();
    expect(userServiceMock.findAll).toHaveBeenCalled();
  });

  it('calling find one method', () => {
    userController.findOne('1');
    expect(userServiceMock.findOne).toHaveBeenCalled();
  });

  it('calling update method', () => {
    const updateUser = { ...user, password: 'newpassword' };
    userController.update('1', updateUser);
    expect(userServiceMock.update).toHaveBeenCalled();
  });

  it('calling remove method', () => {
    userController.remove('1');
    expect(userServiceMock.remove).toHaveBeenCalled();
  });
});
