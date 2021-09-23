import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/contants';
import { OrmModule } from './orm/orm.module';
import { CacheModule } from './cache/redis.module';
import { ConfigModule } from './config/config.module';
import { RouteModule } from './route/route.module';

@Module({
  imports: [
    ConfigModule,
    OrmModule,
    CacheModule,
    AuthModule,
    CustomerModule,
    UserModule,
    RouteModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
