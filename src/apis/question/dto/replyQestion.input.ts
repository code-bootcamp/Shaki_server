import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ReplyQuestionInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  category: string;

  @Field(() => String)
  content: string;

  @Field(() => String)
  replyContent: string;
}
