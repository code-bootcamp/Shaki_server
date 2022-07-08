import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field(() => String)
  roomId: string;

  @Field(() => String)
  writer: string;

  @Field(() => String)
  content: string;

  @Field(() => Int)
  star: number;
}
