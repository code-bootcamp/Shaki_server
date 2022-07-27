import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

/* =======================================================================
 *  TYPE : Resolver
 *  Class : FileResolver
 *  UpdatedAt : 2022-07-25
 *  Description : 파일(이미지)에 대한 API 설정
 *  Constructor : FileService
 *  Content :
 *    [ Mutation => String ] : uploadFile - 이미지 업로드 API
 *    [ Mutation => Boolean ] : removeFile - 이미지 삭제 API
 * ======================================================================= */

@Resolver()
export class FileResolver {
  constructor(
    private readonly fileService: FileService, //
  ) {}

  @Mutation(() => String)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ) {
    return await this.fileService.upload({ file });
  }

  @Mutation(() => Boolean)
  async removeFile(@Args('imageUrl') imageUrl: string) {
    return await this.fileService.remove({ imageUrl });
  }
}
