import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReivewService } from './review.service';
import { Review } from './entities/review.entity';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { ReivewResolver } from './review.resolver';
import { Room } from '../room/entities/room.entity';
import { User } from '../user/entities/user.entity';

/* =======================================================================
 *  TYPE : Module
 *  Class : ReviewModule
 *  UpdatedAt : 2022-07-28
 *  Description : 권한 API에 필요한 각종 파일 설정
 *  Imports : Entity[ Review, User, Room ]
 *  Providers : [
 *    UserService,
 *    JwtService,
 *    AuthService,
 *    ReivewResolver,
 *    ReivewService,
 *  ]
 * ======================================================================= */

@Module({
  imports: [TypeOrmModule.forFeature([Review, Room, User])],
  providers: [
    UserService,
    JwtService,
    AuthService,
    ReivewResolver,
    ReivewService,
  ],
})
export class ReviewModule {}
