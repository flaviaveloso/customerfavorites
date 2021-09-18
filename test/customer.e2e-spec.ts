import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CustomerService } from '../src/customer/customer.service';
import { CreateCustomerDto } from '../src/customer/dto/create-customer.dto';
import { Customer } from '../src/customer/entities/customer.entity';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;

  const customer: CreateCustomerDto = {
    name: 'New Name',
    email: 'customer@email.com',
  };
  const databaseCustomer: Customer = { ...customer, id: 1 };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    return app.close();
  });

  it('/customer (GET)', async () =>
    request(app.getHttpServer()).get('/customer').expect(200).expect([]));

  it('/customer (POST)', async () =>
    request(app.getHttpServer())
      .post('/customer')
      .send(customer)
      .expect(201)
      .expect(databaseCustomer));

  it('/customer/1 (GET)', async () => {
    await app.get(CustomerService).create(customer);
    return request(app.getHttpServer())
      .get('/customer/1')
      .expect(200)
      .expect(databaseCustomer);
  });

  it('/customer/1 (PATCH)', async () => {
    const newAddress = { address: 'New New Address' };
    await app.get(CustomerService).create(customer);
    return request(app.getHttpServer())
      .patch('/customer/1')
      .send(newAddress)
      .expect(200)
      .expect({ ...databaseCustomer, ...newAddress });
  });

  it('Should return 400 when try update name /customer/1 (PATCH)', async () => {
    await app.get(CustomerService).create(customer);
    return request(app.getHttpServer())
      .patch('/customer/1')
      .send({ name: 'New New Name' })
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'property name should not exist',
          'address should not be empty',
        ],
        error: 'Bad Request',
      });
  });

  it('/customer/1 (DELETE)', async () => {
    await app.get(CustomerService).create(customer);
    return request(app.getHttpServer())
      .delete('/customer/1')
      .expect(200)
      .expect(customer);
  });
});
