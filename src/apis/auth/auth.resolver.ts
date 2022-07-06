import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import {
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { GqlAuthRefreshGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService, //
    private readonly userService: UserService,
  ) {}

  @Mutation(() => String)
  getAccessToken() {
    return this.authService.getAccessToken();
  }

  @Mutation(() => String)
  getRefreshToken() {
    return this.authService.getRefreshToKen();
  }

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('pwd') pwd: string,
  ) {
    const user = await this.userService.findOne({ email });

    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    const isAuth = await bcrypt.compare(pwd, user.pwd);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    return this.authService.getAccessToken();
  }

  @Mutation(() => String)
  logout(@Context() context: any) {
    const accessToken = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );
    try {
      jwt.verify(accessToken, 'accesskey');
    } catch {
      throw new UnauthorizedException();
    }
  }
}
