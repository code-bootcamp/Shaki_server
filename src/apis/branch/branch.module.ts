import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchResolver } from './branch.resolver';
import { BranchService } from './branch.service';
import { Branch } from './entites/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branch]),],
  providers: [BranchResolver, BranchService]
})
export class BranchModule {}