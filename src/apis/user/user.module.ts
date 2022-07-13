import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { Images } from '../room/entities/images.entity';
import { Room } from '../room/entities/room.entity';
import { Tags } from '../room/entities/tags.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Room, Tags, Images])],
  providers: [
    UserResolver, //
    UserService,
    JwtAccessStrategy,
  ],
})
export class UserModule {}
