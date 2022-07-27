import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../room/entities/room.entity';
import { BranchResolver } from './branch.resolver';
import { BranchService } from './branch.service';
import { Branch } from './entities/branch.entity';

/* =======================================================================
 *  TYPE : Module
 *  Class : BranchModule
 *  UpdatedAt : 2022-07-25
 *  Description : 지점 API에 필요한 각종 파일 설정
 *  Imports : Entity[ Branch, Room ]
 *  Providers : [ BranchResolver, BranchService ]
 * ======================================================================= */

@Module({
  imports: [TypeOrmModule.forFeature([Branch, Room])],
  providers: [BranchResolver, BranchService],
})
export class BranchModule {}
