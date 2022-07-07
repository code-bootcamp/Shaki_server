import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateReviewInput } from './dto/createReview.input';
import { ReivewService } from './review.service';

@Resolver()
export class ReivewResolver {
  constructor(
    private readonly reviewService: ReivewService, //
  ) {}

  @Mutation(() => Boolean)
  async createReview(
    @Args('createReview') createReviewInput: CreateReviewInput, //
  ) {
    return await this.reviewService.create({ createReviewInput });
  }
}
