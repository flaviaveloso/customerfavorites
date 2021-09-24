import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CustomerService } from '../src/customer/customer.service';
import { CreateCustomerDto } from '../src/customer/dto/create-customer.dto';
import { Customer } from '../src/customer/entities/customer.entity';
import { OrmModule } from '../src/orm/orm.module';
import { ConfigModule } from '../src/config/config.module';
import { AuthModule } from '../src/auth/auth.module';
import { CustomerModule } from '../src/customer/customer.module';
import { UserModule } from '../src/user/user.module';
import { RouteModule } from '../src/route/route.module';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;

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

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule,
        OrmModule,
        AuthModule,
        CustomerModule,
        UserModule,
        RouteModule,
      ],
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

  it('/v1/customer (GET)', async () =>
    request(app.getHttpServer()).get('/v1/customer').expect(200).expect([]));

  it('/v1/customer (POST)', async () =>
    request(app.getHttpServer())
      .post('/v1/customer')
      .send(customer)
      .expect(201)
      .expect(databaseCustomer));

  it('/v1/customer/1 (GET)', async () => {
    await app.get(CustomerService).create(customer);
    return request(app.getHttpServer())
      .get('/v1/customer/1')
      .expect(200)
      .expect(databaseCustomer);
  });

  it('/v1/customer/1 (PATCH)', async () => {
    const newEmail = { email: 'newemail@customer.com' };
    await app.get(CustomerService).create(customer);
    return request(app.getHttpServer())
      .patch('/v1/customer/1')
      .send(newEmail)
      .expect(200)
      .expect({ ...databaseCustomer, ...newEmail });
  });

  it('Should return 400 when try create a user with a already used email (PATCH)', async () => {
    await app.get(CustomerService).create(customer);
    return request(app.getHttpServer())
      .patch('/v1/customer/1')
      .send({ email: 'customer@email.com' })
      .expect(400)
      .expect({
        message: 'This email address is already being used.',
      });
  });

  it('/v1/customer/1 (DELETE)', async () => {
    // await app.get(CustomerService).create(customer);
    return request(app.getHttpServer())
      .delete('/v1/customer/1')
      .expect(200)
      .expect(customer);
  });

  it.only('/v1/customer/1/product (GET)', async () => {
    await app.get(CustomerService).create(customer);
    return request(app.getHttpServer())
      .get('/v1/customer/1/product')
      .expect(200)
      .expect([]);
  });

  it('/v1/user (GET)', () => {
    request(app.getHttpServer()).get('/v1/user').expect(200).expect([]);
  });
});
