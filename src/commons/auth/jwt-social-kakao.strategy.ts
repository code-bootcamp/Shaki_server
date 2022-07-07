import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import 'dotenv/config';

export class JwtKaKaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/kakao',
    });
  }

  validate(_, __, profile) {
    const nickname = profile.emails[0].value.split('@')[0];
    return {
      email: profile._json.kakao_account.email,
      name: profile.displayName,
      // pwd: '1234',
      nickname,
    };
  }
}
