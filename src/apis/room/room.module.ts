import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomResolver } from './room.resolver';
import { RoomService } from './room.service';
import { Room } from './entities/room.entity';
import { Images } from './entities/images.entity';
import { Tags } from './entities/tags.entity';
import { Branch } from '../branch/entities/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Tags, Images, Branch])],
  providers: [RoomResolver, RoomService],
})
export class RoomModule {}
