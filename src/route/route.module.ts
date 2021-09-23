import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    CustomerModule,
    UserModule,
    RouterModule.register([
      {
        path: 'customer',
        module: CustomerModule,
        children: [
          {
            path: 'product',
          },
        ],
      },
      {
        path: 'user',
        module: UserModule,
      },
    ]),
  ],
})
export class RouteModule {}
