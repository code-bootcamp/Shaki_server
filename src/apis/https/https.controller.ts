import { Controller, Get } from '@nestjs/common';

/* =======================================================================
 *  TYPE : Controller
 *  Class : HttpsController
 *  UpdatedAt : 2022-07-28
 *  Description : https 요청 확인을 위한 API
 *  Content :
 *    https [ Get( / ) => String ] : HTTPS 테스트용 API
 * ======================================================================= */
@Controller()
export class HttpsController {
  @Get('/')
  https(): string {
    return 'https';
  }
}
