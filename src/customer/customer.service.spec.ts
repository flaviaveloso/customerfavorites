import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { HttpException } from '@nestjs/common';

describe('CustomerService', () => {
  let customerService: CustomerService;
  let saveMock: jest.Mock;
  let findMock: jest.Mock;
  let findOneMock: jest.Mock;
  let updateMock: jest.Mock;
  let removeMock: jest.Mock;

  const customer: CreateCustomerDto = {
    name: 'New Name',
    email: 'customer@email.com',
  };
  const databaseCustomer: Customer = {
    ...customer,
    id: 1,
    favorites: [],
    setFavorite: () => {
      return;
    },
  };

  const product: Product = {
    id: '83622627-8397-f58f-3652-722389767bb7',
    price: 32.7,
    image:
      'http://challenge-api.luizalabs.com/images/83622627-8397-f58f-3652-722389767bb7.jpg',
    title: 'Creme de Pentear para Cabelos Normais 240ml',
    reviewScore: 5.0,
    updatedAt: new Date('2010-09-22T00:29:48.186Z'),
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
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            save: saveMock,
            find: findMock,
            findOne: findOneMock,
            update: updateMock,
            remove: removeMock,
          },
        },
        {
          provide: getRepositoryToken(Product),
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

    customerService = module.get<CustomerService>(CustomerService);
  });

  it('should call create method with expected params', async () => {
    const createCustomerSpy = jest.spyOn(customerService, 'create');
    saveMock.mockResolvedValue(databaseCustomer);
    const dto = new CreateCustomerDto();
    const newCustomer = await customerService.create(dto);
    return Promise.all([
      expect(createCustomerSpy).toHaveBeenCalledWith(dto),
      expect(newCustomer.name).toStrictEqual('New Name'),
      expect(newCustomer.email).toStrictEqual('customer@email.com'),
      expect(newCustomer.favorites).toStrictEqual([]),
    ]);
  });

  it('should call findOne method with expected param', async () => {
    const findOneSpy = jest.spyOn(customerService, 'findOne');
    findOneMock.mockResolvedValue(databaseCustomer);
    const customerId = 1;
    const customer = await customerService.findOne(customerId);
    return Promise.all([
      expect(findOneSpy).toHaveBeenCalledWith(customerId),
      expect(customer.name).toStrictEqual('New Name'),
      expect(customer.email).toStrictEqual('customer@email.com'),
      expect(customer.favorites).toStrictEqual([]),
    ]);
  });

  it('should call update method with expected params', async () => {
    const newEmail = { email: 'newemail@customer.com' };

    const updateSpy = jest.spyOn(customerService, 'update');
    updateMock.mockResolvedValue({ ...databaseCustomer, ...newEmail });
    findOneMock.mockResolvedValue({ ...databaseCustomer, ...newEmail });

    const customerId = 1;
    const dto = new UpdateCustomerDto();
    const updatedCustomer = await customerService.update(customerId, dto);

    return Promise.all([
      expect(updateSpy).toHaveBeenCalledWith(customerId, dto),
      expect(updatedCustomer.name).toStrictEqual('New Name'),
      expect(updatedCustomer.email).toStrictEqual(newEmail.email),
      expect(updatedCustomer.favorites).toStrictEqual([]),
    ]);
  });

  it('should call remove method with expected param', async () => {
    const removeSpy = jest.spyOn(customerService, 'remove');
    findOneMock.mockResolvedValue(databaseCustomer);
    const customerId = 1;
    customerService.remove(customerId);
    return Promise.all([expect(removeSpy).toHaveBeenCalledWith(customerId)]);
  });

  it('should throw error when try to remove non-existent user', async () => {
    const removeSpy = jest.spyOn(customerService, 'remove');
    findOneMock.mockResolvedValue(undefined);
    const customerId = 1;
    const result = customerService.remove(customerId);
    return Promise.all([
      expect(removeSpy).toHaveBeenCalledWith(customerId),
      expect(result).rejects.toThrow(HttpException),
      expect(result).rejects.toThrow('Customer not found'),
    ]);
  });

  it('should call findAll method with expected param', async () => {
    const findAllSpy = jest.spyOn(customerService, 'findAll');
    findMock.mockResolvedValue([databaseCustomer]);
    const page = 1;
    const customer = await customerService.findAll(page);
    return Promise.all([
      expect(findAllSpy).toHaveBeenCalledWith(page),
      expect(customer).toBeInstanceOf(Array),
      expect(customer).toStrictEqual([databaseCustomer]),
    ]);
  });

  it('should call findProducts method with expected param', async () => {
    const findProductsSpy = jest.spyOn(customerService, 'findProducts');
    findOneMock.mockResolvedValue({
      ...databaseCustomer,
      favorites: [product],
    });
    const customerId = 1;
    const favorites = await customerService.findProducts(customerId);
    return Promise.all([
      expect(findProductsSpy).toHaveBeenCalledWith(customerId),
      expect(favorites).toStrictEqual([product]),
    ]);
  });

  it('should call addProductToFavorites method with expected param', async () => {
    const addProductToFavoritesSpy = jest.spyOn(
      customerService,
      'addProductToFavorites',
    );
    findOneMock
      .mockResolvedValueOnce(product)
      .mockResolvedValueOnce(databaseCustomer);
    saveMock.mockResolvedValueOnce({ ...databaseCustomer, farovites: product });
    const customerId = 1;
    const productId = '83622627-8397-f58f-3652-722389767bb7';
    await customerService.addProductToFavorites(customerId, productId);
    return Promise.all([
      expect(addProductToFavoritesSpy).toHaveBeenCalledWith(
        customerId,
        productId,
      ),
    ]);
  });

  it('should throw error when try to add non-exist product on favorites list', async () => {
    const addProductToFavoritesSpy = jest.spyOn(
      customerService,
      'addProductToFavorites',
    );
    findOneMock
      .mockResolvedValueOnce(product)
      .mockResolvedValueOnce(databaseCustomer);
    saveMock.mockResolvedValueOnce({ ...databaseCustomer, farovites: product });
    const customerId = 1;
    const productId = 'non-exist-product-id';
    const result = customerService.addProductToFavorites(customerId, productId);
    return Promise.all([
      expect(addProductToFavoritesSpy).toHaveBeenCalledWith(
        customerId,
        productId,
      ),
      expect(result).rejects.toThrow(HttpException),
      expect(result).rejects.toThrow(`Product ${productId} not found`),
    ]);
  });

  it('should throw error when try to add a product that already exists on favorites list', async () => {
    const addProductToFavoritesSpy = jest.spyOn(
      customerService,
      'addProductToFavorites',
    );
    findOneMock
      .mockResolvedValueOnce(product)
      .mockResolvedValueOnce({ ...databaseCustomer, favorites: [product] });
    const customerId = 1;
    const productId = '83622627-8397-f58f-3652-722389767bb7';
    const result = customerService.addProductToFavorites(customerId, productId);
    return Promise.all([
      expect(addProductToFavoritesSpy).toHaveBeenCalledWith(
        customerId,
        productId,
      ),
      expect(result).rejects.toThrow(HttpException),
      expect(result).rejects.toThrow(
        'Product already in customer favorites list',
      ),
    ]);
  });

  it('should not call product api when product from database updated', async () => {
    const addProductToFavoritesSpy = jest.spyOn(
      customerService,
      'addProductToFavorites',
    );

    const recentProduct = {
      ...product,
      updatedAt: new Date('2199-09-22T00:29:48.186Z'),
    };

    findOneMock.mockResolvedValueOnce(recentProduct).mockResolvedValueOnce({
      ...databaseCustomer,
    });
    saveMock.mockResolvedValueOnce({
      ...databaseCustomer,
      favorites: recentProduct,
    });

    const customerId = 1;
    const productId = '83622627-8397-f58f-3652-722389767bb7';
    const result = await customerService.addProductToFavorites(
      customerId,
      productId,
    );
    return Promise.all([
      expect(addProductToFavoritesSpy).toHaveBeenCalledWith(
        customerId,
        productId,
      ),
      expect(result).toStrictEqual({
        ...databaseCustomer,
        favorites: recentProduct,
      }),
    ]);
  });

  it('should call removeProductFromFavorites method with expected param', async () => {
    const removeProductFromFavoritesSpy = jest.spyOn(
      customerService,
      'removeProductFromFavorites',
    );
    findOneMock.mockResolvedValue(databaseCustomer);
    saveMock.mockResolvedValueOnce(databaseCustomer);
    const customerId = 1;
    const productId = '83622627';
    const result = await customerService.removeProductFromFavorites(
      customerId,
      productId,
    );
    return Promise.all([
      expect(removeProductFromFavoritesSpy).toHaveBeenCalledWith(
        customerId,
        productId,
      ),
      expect(result).toStrictEqual(databaseCustomer),
    ]);
  });
});
