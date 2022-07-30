import { Field, InputType } from '@nestjs/graphql';

/* =======================================================================
 *  TYPE : InputType
 *  Class : ReplyQuestionInput
 *  UpdatedAt : 2022-07-30
 *  Description : 질문에대한 답변 정보를 받아오기위한 dto
 *  Content :
 *    [ Column && Field ] : name, email, title, category, content, replyContent
 * ======================================================================= */

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
