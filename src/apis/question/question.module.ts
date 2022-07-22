import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { Room } from '../room/entities/room.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Question } from './entities/question.entity';
import { QuestionResolver } from './question.resolver';
import { QuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, User, Room])],
  providers: [
    QuestionResolver, //
    QuestionService,
    UserService,
    AuthService,
    JwtService,
  ],
})
export class QuestionModule {}
