import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchResolver } from './branch.resolver';
import { BranchService } from './branch.service';
import { Branch } from './entites/branch.entity';
import { Images } from './entites/images.entity';
import { Tags } from './entites/tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branch, Tags, Images]),],
  providers: [BranchResolver, BranchService]
})
export class BranchModule {}