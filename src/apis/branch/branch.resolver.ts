import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BranchService } from './branch.service';
import { CreateBranchInput } from './dto/createBranch.input';
import { Branch } from './entites/branch.entity';

@Resolver()
export class BranchResolver {
  constructor(
    private readonly branchService: BranchService //
  ) {}

  @Query(() => [Branch])
  async fetchBranchs() {
    return await this.branchService.find()
  }

  @Mutation(() => Boolean)
  async createBranch(
    @Args('createBarnch') createBranchInput: CreateBranchInput //
  ) {
    await this.branchService.create({ createBranchInput })

    return true;
  }
}