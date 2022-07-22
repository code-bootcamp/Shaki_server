import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import {
  CACHE_MANAGER,
  Inject,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

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


    await this.authService.getRefreshToKen({ email, res: context.req.res });
    return await this.authService.getAccessToken({ email });
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
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  @Mutation(() => Number)
  async checkEmail(@Args('email') email: string) {
    const title = 'Shaki 인증번호';
    const content = this.authService.getAuthNum();
    return await this.authService.sendEmail({
      title,
      email,
      content,
      replyContent: null,
    });
  }

  @Mutation(() => String)
  async restoreAccessToken(
    @Context() context: any, //
  ) {
    const email = await this.authService.refreshTokenCheck({ context });
    return await this.authService.getAccessToken({ email });
  }
}
