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
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/auth/gql-user.param';
import { UserService } from '../user/user.service';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';

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

    // this.authService.getRefreshToKen({ user, res: context.req.res });
    this.authService.getAccessToken({ user, res: context.req.res });
    return true;
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @CurrentUser() currentUser: any, //
    @Context() context: any,
  ) {
    return this.authService.getAccessToken({
      user: currentUser,
      res: context.req.res,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(@Context() context: any) {
    const accessToken = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );
    const refreshToken = context.req.headers.cookie.replace(
      'refreshToken=',
      '',
    );
    try {
      jwt.verify(accessToken, 'accesskey');
      jwt.verify(refreshToken, 'refreshkey');
    } catch {
      throw new UnauthorizedException();
    }
    await this.cacheManager.set(`accessToken:${accessToken}`, 'accessToken', {
      ttl: 90,
    });
    await this.cacheManager.set(
      `refreshToken:${refreshToken}`,
      'refreshToken',
      {
        ttl: 90,
      },
    );
    return '로그아웃 되었습니다.';
  }

  @Mutation(() => Number)
  async checkEmail(@Args('email') email: string) {
    return await this.authService.sendEmail({ email });
  }
}
