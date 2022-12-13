import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-socket',
          options: {
            address: process.env.LOGASTASH_HOST,
            port: process.env.LOGASTASH_PORT,
            mode: 'tcp',
            //port: 5044,
            //mode: 'udp',
          },
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
