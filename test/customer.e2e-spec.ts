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
    const newEmail = { email: 'newemail@customer.com' };
    await app.get(CustomerService).create(customer);
    return request(app.getHttpServer())
      .patch('/customer/1')
      .send(newEmail)
      .expect(200)
      .expect({ ...databaseCustomer, ...newEmail });
  });

  it('Should return 400 when try create a user with a already used email (PATCH)', async () => {
    await app.get(CustomerService).create(customer);
    return request(app.getHttpServer())
      .patch('/customer/1')
      .send({ email: 'customer@email.com' })
      .expect(400)
      .expect({
        message: 'This email address is already being used.',
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
