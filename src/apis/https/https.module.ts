import { Module } from '@nestjs/common';
import { HttpsController } from './https.controller';

@Module({
  controllers: [HttpsController],
})
export class HttpsModule {}
