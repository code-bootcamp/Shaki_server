import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { Room } from '../room/entities/room.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Review } from './entities/review.entity';
import { ReivewResolver } from './review.resolver';
import { ReivewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Room, User])],
  providers: [
    UserService,
    JwtService,
    AuthService, //
    ReivewResolver,
    ReivewService,
  ],
})
export class ReviewModule {}
