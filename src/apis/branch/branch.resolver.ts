import { Resolver, Query } from '@nestjs/graphql';
import { Room } from '../room/entities/room.entity';
import { BranchService } from './branch.service';

/* =======================================================================
 *  TYPE : Resolver
 *  Class : BranchResolver
 *  UpdatedAt : 2022-07-25
 *  Description : 지점에 대한 API 설정
 *  Constructor : BranchService
 *  Content :
 *   [ Query ]
 *     fetchBraches [ null => [Room] ] : 지점별 별점 가장 높은 방 1개 조회
 * ======================================================================= */

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
