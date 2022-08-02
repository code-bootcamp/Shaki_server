import {
  Inject,
  Injectable,
  CACHE_MANAGER,
  UnauthorizedException,
} from '@nestjs/common';
import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

/* =======================================================================
 *  TYPE : Service
 *  Class : AuthService
 *  UpdatedAt : 2022-08-02
 *  Description : 권한 API에 필요한 각종 함수 설정
 *  Constructor : Repository<User>, JwtService, UserService, Cache
 *  Content :
 *    getAccessToken    [ email: string  => string ] : access 토큰 발급
 *    getRefreshToKen   [ email: string, res: any => Boolean ]
 *                         : refresh 토큰 발급(cookie)
 *
 *    getUserInfo       [ req: any, res: any => redirect ]
 *                         : 소셜로그인 회원확인 || 회원가입
 *                         : 소셜로그인 refresh 발급
 *
 *    sendEmai          [ title: string, email: string, content:string, replyContent:string => String ]
 *                         : 이메일 전송 함수
 *                           - 회원가입 이메일 확인을 위한 이메일 전송
 *                           - 임시비밀번호 발급 이메일 전송
 *                           - 문의에 대한 답변 이메일 전송
 *
 *    getAuthNum        [ null => Strig ] : 이메일 인증에 필요한 인증번호 생성
 *    accessTokenCheck  [ context: any => String ]
 *                         : request에 포함된 access 토큰 확인
 *
 *    refreshTokenCheck [ context: any => String ]
 *                         : request에 포함된 refresh 토큰 확인
 * ======================================================================= */

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

  getRefreshToKen({ email, res, req }) {
    try {
      const refreshToken = this.jwtService.sign(
        { email: email },
        { secret: process.env.REFRESH_KEY, expiresIn: '2w' },
      );

      const allowedOrigins = ['https://sha-ki.shop/', 'http://localhost:3000/'];
      const origin = req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }

      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,OPTIONS,POST,PUT',
      );
      res.setHeader(
        'Access-Control-Allow-Header',
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
      );

      res.cookie('refreshToken', refreshToken, {
        path: '/',
        domain: '.shaki-server.shop',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      return true;
    } catch {
      return false;
    }
  }

  async getUserInfo(req, res) {
    let user = await this.userService.findOne({ email: req.user.email });

    if (!user) {
      user = await this.userRepository.save({
        email: req.user.email,
        name: req.user.name,
      });
    }

    this.getRefreshToKen({ email: user.email, res, req });
    res.redirect('https://sha-ki.shop/main');
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
    try {
      if (replyContent === null) {
        await transporter.sendMail({
          from: EMAIL_SENDER,
          to: email,
          subject: title,
          html: `
            <div style="width: 1400px; font-size: 15px; display: flex; margin-top: 30px" >
              <img
                src="https://storage.googleapis.com/front_image/shakiRight.png"
                style="width: 10%; height: 100%"
              />
              <div style="width 90%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: start; margin-top: 20px; margin-left: 100px">
                <div style="display: flex; flex-direction: column; align-items: center; ">
                </div>
                <h1 style="border-bottom: 2px solid gray; margin: 20px 0">${title}</h1>
                <div style="font-size: 16px;">안녕하세요 :)</div>
                <div style="border-bottom: 2px solid blue; display: flex; margin: 20px 0; padding-bottom: 20px">
                  <p style="color: blue; font-size: 16px;">쉐이키입니다. &nbsp;</p>
                  <p style="font-size: 16px;">아래와 같이 ${
                    title.split(' ')[1]
                  }를 보내드립니다.</p>
                </div>
                <b style="font-size: 18px; margin: 20px 0;">발신인 : (주) Shaki</b>
                <div style="font-size: 18px;">${
                  title.split(' ')[1]
                } : ${content}</div>
              </div>
            </div>
          `,
        });
      } else {
        await transporter.sendMail({
          from: EMAIL_SENDER,
          to: email,
          subject: title,
          html: `
            <div style="width: 1400px; font-size: 15px; display: flex; margin-top: 30px" >
              <img
                src="https://storage.googleapis.com/front_image/shakiRight.png"
                style="width: 10%; height: 100%"
              />
              <div style="width 90%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: start; margin-top: 20px; margin-left: 100px">
                <div style="display: flex; flex-direction: column; align-items: center; ">
                </div>
                <h1 style="border-bottom: 2px solid gray; margin: 20px 0">[Shaki] 1:1문의 답변사항입니다.</h1>
                <div style="font-size: 16px;">안녕하세요 :)</div>
                <div style="border-bottom: 2px solid blue; display: flex; margin: 20px 0; padding-bottom: 20px">
                  <p style="color: blue; font-size: 16px;">쉐이키입니다. &nbsp;</p>
                  <p style="font-size: 16px;">고객님의 1:1 문의사항에 대해 아래와같이 답변드립니다.</p>
                </div>
                <div>${content}</div>
                <div style="border: 1px solid gray; margin: 10px 0; width: 100%"></div>
                <div>${replyContent}</div>
              </div>
            </div>
          `,
        });
      }
      return content;
    } catch {
      return '이메일 확인에 실패했습니다.';
    }
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
