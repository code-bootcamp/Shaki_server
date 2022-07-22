import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateReviewInput } from './dto/createReview.input';
import { ReivewService } from './review.service';
import { Review } from './entities/review.entity';
import { AuthService } from '../auth/auth.service';

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
    @Args('createReview') createReviewInput: CreateReviewInput, //
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
}
