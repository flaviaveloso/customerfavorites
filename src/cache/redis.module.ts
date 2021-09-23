import { Module } from '@nestjs/common';
import * as Nest from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    Nest.CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: configService.get('REDIS_GLOBAL_TTL'),
      }),
    }),
  ],
  exports: [CacheModule, Nest.CacheModule],
})
export class CacheModule {}
