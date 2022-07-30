import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';

/* =======================================================================
 *  TYPE : Controller
 *  Class : AuthController
 *  UpdatedAt : 2022-07-26
 *  Description : 소셜로그인 API 설정
 *  Constructor : AuthService
 *  Content :
 *    loginGoogle [ Get( /login/google ) => Redirect ] : 구글 로그인 API
 *    loginNaver  [ Get( /login/naver )  => Redirect ] : 네이버 로그인 API
 *    loginKakao  [ Get( /login/kakao )  => Redirect ] : 카카오 로그인 API
 * ======================================================================= */

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request, //
    @Res() res: Response,
  ) {
    await this.authService.getUserInfo(req, res);
  }

  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(
    @Req() req: Request, //
    @Res() res: Response,
  ) {
    await this.authService.getUserInfo(req, res);
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request, //
    @Res() res: Response,
  ) {
    await this.authService.getUserInfo(req, res);
  }
}
