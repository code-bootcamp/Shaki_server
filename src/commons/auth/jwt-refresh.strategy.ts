import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookies = req.headers.cookies;
        if (cookies) return cookies.replace('refreshToken=', '');
      },
      secretOrkey: 'refreshkey',
    });
  }
  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
