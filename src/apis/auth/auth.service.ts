import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as nodemailer from 'nodemailer';
import 'dotenv/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly userService: UserService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAccessToken({ user, res }) {
    const accessToken = this.jwtService.sign(
      { email: user.email },
      { secret: 'accesskey', expiresIn: '1h' },
    );
    console.log('123');

    res.setHeader('Set-Cookie', `accessToken=${accessToken}; path=/;`);
  }

  getRefreshToKen({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email },
      { secret: 'refreshkey', expiresIn: '2w' },
    );
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.shakiback.shop; SameSite=None; Secure; httpOnly;`,
    );
  }

  async getUserInfo(req, res) {
    let user = await this.userService.findOne({ email: req.user.email });

    // 2. 회원가입
    if (!user) {
      user = await this.userRepository.save({
        email: req.user.email,
        name: req.user.name,
      });
    }

    // 3. 로그인
    this.getAccessToken({ user, res });
    this.getRefreshToKen({ user, res });
    res.redirect('http://localhost:3000/main');
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

    return token;
  }

  getAuthNum() {
    return String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0');
  }
}
