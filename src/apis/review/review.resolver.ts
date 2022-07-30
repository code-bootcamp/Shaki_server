import { ReivewService } from './review.service';
import { Review } from './entities/review.entity';
import { AuthService } from '../auth/auth.service';
import { CreateReviewInput } from './dto/createReview.input';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

/* =======================================================================
 *  TYPE : Resolver
 *  Class : ReivewResolver
 *  UpdatedAt : 2022-07-28
 *  Description : 리뷰에 대한 API 설정
 *  Constructor : ReivewService, AuthService
 *  Content :
 *   [ Mutation ]
 *     fetchReviews   [ pageNum: number, roomId: string => [Review] ]
 *                         : 방에 해당하는 전체 리뷰 조회
 *
 *     createReview   [ createReviewInput: CreateReviewInput, context: any => Boolean ]
 *                         : 리뷰 저장 요청
 *
 *     deleteReview   [ reviewId: string => Boolean ] : 리뷰 삭제 요청
 *     updateReview   [ reviewId: string, star: number, content: string => Boolean ]
 *                         : 리뷰 수정 요청
 * ======================================================================= */

@Resolver()
export class ReivewResolver {
  constructor(
    private readonly reviewService: ReivewService, //
    private readonly authService: AuthService,
  ) {}
  @Query(() => [Review])
  async fetchReviews(
    @Args('pageNum') pageNum: number, //
    @Args('roomId') roomId: String,
  ) {
    return await this.reviewService.find({ pageNum, roomId });
  }

  @Mutation(() => Boolean)
  async createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput, //
    @Context() context: any, //
  ) {
    const email = await this.authService.accessTokenCheck({ context });
    return await this.reviewService.create({ email, createReviewInput });
  }

  @Mutation(() => Boolean)
  async deleteReview(
    @Args('reviewId') reviewId: string, //
  ) {
    return this.reviewService.delete({ reviewId });
  }

  @Mutation(() => Boolean)
  async updateReview(
    @Args('reviewId') reviewId: string, //
    @Args('star') star: number,
    @Args('content') content: string,
  ) {
    return this.reviewService.update({ reviewId, star, content });
  }
}
