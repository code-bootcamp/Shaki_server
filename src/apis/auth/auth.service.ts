import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly userService: UserService,
  ) {}

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'accesskey', expiresIn: '1h' },
    );
  }

  getRefreshToKen({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'refreshkey', expiresIn: '2w' },
    );
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
  }

  async getUserInfo(req, res) {
    let user = await this.userService.findOne({ email: req.user.email });
    const hashedPwd = await bcrypt.hash(req.user.password, 10);
    // 2. 회원가입
    if (!user) {
      user = await this.userService.create({
        email: req.user.email,
        hashedPwd,
        name: req.user.name,
        phone_num: req.user.phone_number,
      });
    }
    // 3. 로그인
    this.getRefreshToKen({ user, res });
    res.redirect('http://localhost:3000/result.html');
  }
}
