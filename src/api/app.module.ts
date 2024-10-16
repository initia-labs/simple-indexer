import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { LoggerModule } from 'nestjs-pino'
import pino from 'pino'
import { AppController } from './app.controller'
import { validate } from './env.validation'
import { IndexerModule } from './indexer/indexer.module'

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, validate }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const pinoHttp: pino.LoggerOptions = {
          name: config.get<string>('LOG_NAME'),
          level: config.get<string>('LOG_LEVEL'),
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: false,
              singleLine: false,
              translateTime: false,
            },
          },
        }

        if (config.get<string>('NODE_ENV') !== 'production') {
          pinoHttp.transport = {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
              translateTime: true,
            },
          }
        }

        return { pinoHttp }
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: parseInt(config.get<string>('THROTTLE_TTL', '60'), 10),
          limit: parseInt(config.get<string>('THROTTLE_LIMIT', '20'), 10),
        },
      ],
    }),

    IndexerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
