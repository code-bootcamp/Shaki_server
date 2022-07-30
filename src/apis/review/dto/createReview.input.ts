import { Field, InputType, Int } from '@nestjs/graphql';

/* =======================================================================
 *  TYPE : InputType
 *  Class : CreateReviewInput
 *  UpdatedAt : 2022-07-30
 *  Description : 리뷰 정보를 받아오기위한 dto
 *  Content :
 *    [ Column && Field ] : roomId, content, star
 * ======================================================================= */

@InputType()
export class CreateReviewInput {
  @Field(() => String)
  roomId: string;

  @Field(() => String)
  content: string;

  @Field(() => Int)
  star: number;
}
