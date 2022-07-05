import { Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  @Mutation(() => String)
  getAccessToken() {
    return this.authService.getAccessToken();
  }

  @Mutation(() => String)
  getRefreshToken() {
    return this.authService.getRefreshToKen({});
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
