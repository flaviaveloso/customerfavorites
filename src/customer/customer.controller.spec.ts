import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomerController', () => {
  let customerController: CustomerController;
  let customerServiceMock: CustomerService;

  beforeEach(async () => {
    const ServiceProviderMock = {
      provide: CustomerService,
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
        addProductToFavorites: jest.fn(() => {
          return;
        }),
        findProducts: jest.fn(() => {
          return;
        }),
        removeProductFromFavorites: jest.fn(() => {
          return;
        }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [CustomerService, ServiceProviderMock],
    }).compile();

    customerController = module.get<CustomerController>(CustomerController);
    customerServiceMock = module.get<CustomerService>(CustomerService);
  });

  it('calling create method', () => {
    const dto = new CreateCustomerDto();
    customerController.create(dto);
    expect(customerServiceMock.create).toHaveBeenCalled();
    expect(customerServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('calling findall method', () => {
    customerController.findAll();
    expect(customerServiceMock.findAll).toHaveBeenCalled();
  });

  it('calling find one method', () => {
    customerController.findOne('1');
    expect(customerServiceMock.findOne).toHaveBeenCalled();
  });

  it('calling update method', () => {
    const updateCustomer = new UpdateCustomerDto();
    customerController.update('1', updateCustomer);
    expect(customerServiceMock.update).toHaveBeenCalled();
  });

  it('calling remove method', () => {
    customerController.remove('1');
    expect(customerServiceMock.remove).toHaveBeenCalled();
  });

  it('calling addProductToFavorites method', () => {
    customerController.favoriteProduct('1', '1');
    expect(customerServiceMock.addProductToFavorites).toHaveBeenCalled();
  });

  it('calling findFavoritesProducts method', () => {
    customerController.findFavoritesProducts('1');
    expect(customerServiceMock.findProducts).toHaveBeenCalled();
  });

  it('calling removeFavoriteProduct method', () => {
    customerController.removeFavoriteProduct('1', '1');
    expect(customerServiceMock.removeProductFromFavorites).toHaveBeenCalled();
  });
});
