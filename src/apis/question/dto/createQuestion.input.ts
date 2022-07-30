import { Field, InputType } from '@nestjs/graphql';

/* =======================================================================
 *  TYPE : InputType
 *  Class : CreateQuestionInput
 *  UpdatedAt : 2022-07-30
 *  Description : 질문 정보를 받아오기위한 dto
 *  Content :
 *    [ Column && Field ] : name, email, title, category, content
 * ======================================================================= */

@InputType()
export class CreateQuestionInput {
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
}
