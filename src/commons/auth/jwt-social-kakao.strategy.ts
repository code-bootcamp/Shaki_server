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

  validate(accessToken, refreshToken, profile) {
    return {
      email: profile._json.kakao_account.email,
      pwd: '1234',
      name: profile.displayName,
      phone_num: '01025182688',
    };
  }
}
