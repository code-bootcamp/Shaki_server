import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as nodemailer from 'nodemailer';
import 'dotenv/config';
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
    // const hashedPwd = await bcrypt.hash(req.user.password, 10);
    // 2. 회원가입
    // if (!user) {
    //   user = await this.userService.create({
    //     email: req.user.email,
    //     name: req.user.name,
    //   });
    // }

    // 3. 로그인
    this.getRefreshToKen({ user, res });
    res.redirect('http://localhost:3000/result.html');
  }

  async sendEmail({ email }) {
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;
    const EMAIL_SENDER = process.env.EMAIL_SENDER;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const token = this.getAuthNum();
    const result = await transporter.sendMail({
      from: EMAIL_SENDER,
      to: email,
      subject: 'Shaki 인증번호',
      html: token,
    });
  }

  getAuthNum() {
    return String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0');
  }
}
