import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { AuthService } from '../auth/auth.service';
import { Images } from '../room/entities/images.entity';
import { Room } from '../room/entities/room.entity';
import { Tags } from '../room/entities/tags.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([User, Room, Tags, Images]),
  ],
  providers: [
    UserResolver, //
    UserService,
    JwtAccessStrategy,
    AuthService,
  ],
})
export class UserModule {}
