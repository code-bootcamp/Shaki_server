import { UnauthorizedException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateReviewInput } from './dto/createReview.input';
import { ReivewService } from './review.service';
import * as jwt from 'jsonwebtoken';

@Resolver()
export class ReivewResolver {
  constructor(
    private readonly reviewService: ReivewService, //
  ) {}

  @Mutation(() => Boolean)
  async createReview(
    @Args('createReview') createReviewInput: CreateReviewInput, //
    @Context() context: any, //
  ) {
    const accessToken = context.req.headers.authorization.split(' ')[1];
    try {
      const checkToken = jwt.verify(accessToken, 'accesskey');
      const email = checkToken['email'];
      return await this.reviewService.create({ email, createReviewInput });
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
