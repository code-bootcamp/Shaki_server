import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { Room } from '../room/entities/room.entity';
import { Tags } from '../room/entities/tags.entity';
import { Images } from '../room/entities/images.entity';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';

/* =======================================================================
 *  TYPE : Module
 *  Class : UserModule
 *  UpdatedAt : 2022-07-30
 *  Description : 유저 정보 API에 필요한 각종 파일 설정
 *  Imports : Entity[ User, Room, Tags, Images ], JwtModule
 *  Providers : [
 *    UserService,
 *    AuthService,
 *    UserResolver,
 *    JwtAccessStrategy,
 *  ]
 * ======================================================================= */

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([User, Room, Tags, Images]),
  ],
  providers: [
    UserService, //
    AuthService,
    UserResolver,
    JwtAccessStrategy,
  ],
})
export class UserModule {}
