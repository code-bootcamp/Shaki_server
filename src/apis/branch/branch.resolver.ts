import { Resolver, Query } from '@nestjs/graphql';
import { Room } from '../room/entities/room.entity';
import { BranchService } from './branch.service';

@Resolver()
export class BranchResolver {
  constructor(
    private readonly branchService: BranchService, //
  ) {}

  @Query(() => [Room])
  async fetchBranches() {
    return await this.branchService.find();
  }
}
