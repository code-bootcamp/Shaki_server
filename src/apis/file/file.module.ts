import { Module } from '@nestjs/common';
import { FileResolver } from './file.resolver';
import { FileService } from './file.service';

/* =======================================================================
 *  TYPE : Module
 *  Class : FileModule
 *  UpdatedAt : 2022-07-25
 *  Description : 파일(이미지) API에 필요한 각종 파일 설정
 *  Providers : [ FileResolver, FileService ]
 * ======================================================================= */

@Module({
  providers: [
    FileResolver, //
    FileService,
  ],
})
export class FileModule {}
