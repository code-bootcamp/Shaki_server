import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomResolver } from './room.resolver';
import { RoomService } from './room.service';
import { Room } from './entities/room.entity';
import { Images } from './entities/images.entity';
import { Tags } from './entities/tags.entity';
import { Branch } from '../branch/entities/branch.entity';
import { FileService } from '../file/file.service';

/* =======================================================================
 *  TYPE : Module
 *  Class : RoomModule
 *  UpdatedAt : 2022-07-30
 *  Description : 지점별 방 API에 필요한 각종 파일 설정
 *  Imports : Entity[ Tags, Images, Room, Branch ]
 *  Providers : [
 *    RoomResolver,
 *    RoomService,
 *    FileService,
 *  ]
 * ======================================================================= */
@Module({
  imports: [TypeOrmModule.forFeature([Room, Tags, Images, Branch])],
  providers: [RoomResolver, RoomService, FileService],
})
export class RoomModule {}
