import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
  ) {}

  getAccessToken() {
    return this.jwtService.sign(
      { email: 'aaa', sub: 'bbb' },
      { secret: 'accesskey', expiresIn: '1h' },
    );
  }

  getRefreshToKen() {
    return this.jwtService.sign(
      { email: 'aaa', sub: 'bbb' },
      { secret: 'refreshkey', expiresIn: '2w' },
    );
  }
}
