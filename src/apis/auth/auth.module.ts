import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { Room } from '../room/entities/room.entity';
import { User } from '../user/entities/user.entity';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { JwtKaKaoStrategy } from 'src/commons/auth/jwt-social-kakao.strategy';
import { JwtNaverStrategy } from 'src/commons/auth/jwt-social-naver.strategy';
import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social-google.strategy';

/* =======================================================================
 *  TYPE : Module
 *  Class : AuthModule
 *  UpdatedAt : 2022-07-26
 *  Description : 권한 API에 필요한 각종 파일 설정
 *  Imports : Entity[ User, Room ], JwtModule.register
 *  Controllers : AuthController
 *  Providers : [
 *    AuthService,
 *    UserService,
 *    AuthResolver,
 *    JwtNaverStrategy,
 *    JwtKaKaoStrategy,
 *    JwtGoogleStrategy,
 *    JwtRefreshStrategy,
 *  ]
 * ======================================================================= */
@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([User, Room]),
  ],
  providers: [
    AuthService, //
    UserService,
    AuthResolver,
    JwtNaverStrategy,
    JwtKaKaoStrategy,
    JwtGoogleStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [
    AuthController, //
  ],
})
export class AuthModule {}
