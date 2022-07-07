import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import 'dotenv/config';

export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/naver',
    });
  }

  validate(accessToken, refreshToken, profile) {
    return {
      email: profile.emails[0].value,
      pwd: '1234',
      name: profile.displayName,
      phone_num: '01025182688',
    };
  }
}
