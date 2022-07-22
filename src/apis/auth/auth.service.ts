import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';
import 'dotenv/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly userService: UserService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  getAccessToken({ email }) {
    const accessToken = this.jwtService.sign(
      { email: email },
      { secret: process.env.ACCESS_KEY, expiresIn: '1h' },
    );

    return accessToken;
  }

  getRefreshToKen({ email, res }) {
    const refreshToken = this.jwtService.sign(
      { email: email },
      { secret: process.env.REFRESH_KEY, expiresIn: '2w' },
    );

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );

    res.cookie('refreshToken', refreshToken, {
      path: '/',
      domain: '.shaki-server.shop',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }

  async getUserInfo(req, res) {
    let user = await this.userService.findOne({ email: req.user.email });

    if (!user) {
      user = await this.userRepository.save({
        email: req.user.email,
        name: req.user.name,
      });
    }

    this.getRefreshToKen({ email: user.email, res });
    res.redirect('http://localhost:3000/main');
  }

  async sendEmail({ title, email, content, replyContent }) {
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

    if (replyContent === null) {
      await transporter.sendMail({
        from: EMAIL_SENDER,
        to: email,
        subject: title,
        html: content,
      });
    } else {
      await transporter.sendMail({
        from: EMAIL_SENDER,
        to: email,
        subject: title,
        html: `
        ${content}
        ---------------------------
        ${replyContent}
        `,
      });
    }

    return content;
  }

  getAuthNum() {
    return String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0');
  }

  async accessTokenCheck({ context }) {
    try {
      let accessToken = context.req.headers.authorization.split(' ')[1];
      const logoutCheck = await this.cacheManager.get(accessToken);
      if (!logoutCheck) {
        const checkToken = jwt.verify(accessToken, process.env.ACCESS_KEY);
        return checkToken['email'];
      } else {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  async refreshTokenCheck({ context }) {
    try {
      const refreshToken = context.req.headers.cookie.split('=')[1];
      const logoutCheck = await this.cacheManager.get(refreshToken);
      if (!logoutCheck) {
        const checkToken = jwt.verify(refreshToken, process.env.REFRESH_KEY);
        return checkToken['email'];
      } else {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
