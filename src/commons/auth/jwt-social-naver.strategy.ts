import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import 'dotenv/config';

export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: 'https://shaki-server.shop/login/naver',
    });
  }

  validate(_, __, profile) {
    return {
      email: profile.emails[0].value,
      name: profile.displayName,
    };
  }
}
