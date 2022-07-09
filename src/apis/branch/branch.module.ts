import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../room/entities/room.entity';
import { BranchResolver } from './branch.resolver';
import { BranchService } from './branch.service';
import { Branch } from './entities/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branch, Room])],
  providers: [BranchResolver, BranchService],
})
export class BranchModule {}
