import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

const signalsNames: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGHUP'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  const logger = app.get(Logger);

  signalsNames.forEach((signalName) =>
    process.on(signalName, (signal) => {
      logger.log(`Retrieved signal: ${signal}, application terminated`);
      process.exit(0);
    }),
  );

  process.on('uncaughtException', (error: Error) => {
    logger.error({ err: error });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Promise Rejection, reason: ${reason}`);
    promise.catch((err: Error) => {
      logger.error({ err });
      process.exit(1);
    });
  });

  app.useLogger(logger);
  await app.listen(3000);
}
bootstrap();
