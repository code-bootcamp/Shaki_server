import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BranchService } from './branch.service';
import { CreateBranchInput } from './dto/createBranch.input';
import { Branch } from './entites/branch.entity';

@Resolver()
export class BranchResolver {
  constructor(
    private readonly branchService: BranchService, //
  ) {}

  @Query(() => [Branch])
  async fetchBranches() {
    return await this.branchService.find();
  }

  @Mutation(() => Boolean)
  async createBranch(
    @Args('createBranch') createBranchInput: CreateBranchInput, //
  ) {
    const result = await this.branchService.create({ createBranchInput });
    if (result) return true;
  }
}
