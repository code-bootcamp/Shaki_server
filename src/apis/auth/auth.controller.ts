import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';

interface IQAuthUser {
  user: Pick<User, 'email' | 'name' | 'pwd' | 'phone_num' | 'nickname'>;
}

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IQAuthUser, //
    @Res() res: Response,
  ) {
    this.authService.getUserInfo(req, res);
  }

  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(
    @Req() req: Request & IQAuthUser, //
    @Res() res: Response,
  ) {
    this.authService.getUserInfo(req, res);
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IQAuthUser, //
    @Res() res: Response,
  ) {
    this.authService.getUserInfo(req, res);
  }
}
