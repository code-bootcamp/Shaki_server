import {
  Inject,
  CACHE_MANAGER,
  UnauthorizedException,
  UnprocessableEntityException,
  InternalServerErrorException,
} from '@nestjs/common';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

/* =======================================================================
 *  TYPE : Resolver
 *  Class : AuthResolver
 *  UpdatedAt : 2022-07-26
 *  Description : 권한에 대한 API 설정
 *  Constructor : AuthService, UserService, Cache
 *  Content :
 *   [ Mutation ]
 *     login              [ email: string, pwd: string, context: any => String ]
 *                          : 로그인 API
 *
 *     logout             [ context: any => Boolean ] : 로그아웃 API
 *     checkEmail         [ email: string => String ] : 회원가입을 위한 이메일 체크
 *     restoreAccessToken [ context: any => String  ] : AccessToken 재발급
 * ======================================================================= */

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService, //
    private readonly userService: UserService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('pwd') pwd: string,
    @Context() context: any,
  ) {
    const user = await this.userService.findOne({ email });
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    const isAuth = await bcrypt.compare(pwd, user.pwd);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    const refreshToken = await this.authService.getRefreshToKen({
      email,
      res: context.req.res,
      req: context.req,
    });

    if (refreshToken) {
      return await this.authService.getAccessToken({ email });
    } else {
      throw new InternalServerErrorException('refresh 토큰 발급 실패');
    }
  }

  @Mutation(() => Boolean)
  async logout(
    @Context() context: any, //
  ) {
    const headers = context.req.headers;
    let accessToken, refreshToken;
    if (headers.authorization)
      accessToken = context.req.headers.authorization.split(' ')[1];
    if (headers.cookie) refreshToken = context.req.headers.cookie.split('=')[1];

    try {
      const myAccess = jwt.verify(accessToken, process.env.ACCESS_KEY);
      const myRefresh = jwt.verify(refreshToken, process.env.REFRESH_KEY);

      await this.cacheManager.set(accessToken, 'accessToken', {
        ttl: myAccess['exp'] - myAccess['iat'],
      });

      await this.cacheManager.set(refreshToken, 'refreshToken', {
        ttl: myRefresh['exp'] - myRefresh['iat'],
      });

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => String)
  async checkEmail(@Args('email') email: string) {
    const check = await this.userService.findOne({ email });
    if (!check) {
      const title = 'Shaki 인증번호';
      const content = this.authService.getAuthNum();
      const result = await this.authService.sendEmail({
        title,
        email,
        content,
        replyContent: null,
      });

      return result;
    } else {
      throw new InternalServerErrorException('이미 등록된 이메일입니다.');
    }
  }

  @Mutation(() => String)
  async restoreAccessToken(
    @Context() context: any, //
  ) {
    const email = await this.authService.refreshTokenCheck({ context });

    const result = await this.authService.getAccessToken({ email });
    return result;
  }
}
