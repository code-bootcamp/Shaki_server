import { Field, InputType, Int } from '@nestjs/graphql';

/* =======================================================================
 *  TYPE : InputType
 *  Class : CreateUserInput
 *  UpdatedAt : 2022-07-30
 *  Description : 유저 정보를 받아오기위한 dto
 *  Content :
 *    [ Column && Field ] : name, pwd, phone_num, email
 * ======================================================================= */

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  pwd: string;

  @Field(() => String)
  phone_num: string;

  @Field(() => String)
  email: string;
}
