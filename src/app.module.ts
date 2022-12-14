import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        name: 'nestjs-poc',
        transport: {
          target: 'pino-socket',
          options: {
            address: process.env.LOGASTASH_HOST,
            port: process.env.LOGASTASH_PORT,
            mode: process.env.LOGASTASH_MODE,
            //mode: 'tcp',
            //port: 5044,
          },
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
