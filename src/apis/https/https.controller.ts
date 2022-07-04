import { Controller, Get } from '@nestjs/common';

@Controller()
export class HttpsController {
  @Get('/')
  https(): string {
    return 'https';
  }
}
