import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  onModuleInit() {
    this.logger.log('log here');
    this.logger.warn('warn here');
    this.logger.error('error here');
  }

  getHello(): string {
    return 'Hello World!';
  }
}
