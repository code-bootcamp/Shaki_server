import { Module } from '@nestjs/common';
import { HttpsController } from './https.controller';

/* =======================================================================
 *  TYPE : Module
 *  Class : HttpsModule
 *  UpdatedAt : 2022-07-28
 *  Description : HTTPS요청 확인을 위한 API 파일 설정
 *  Controllers : HttpsController
 * ======================================================================= */
@Module({
  controllers: [HttpsController],
})
export class HttpsModule {}
