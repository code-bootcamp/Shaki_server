import { Field, InputType, Int } from '@nestjs/graphql';

/* =======================================================================
 *  TYPE : InputType
 *  Class : UpdateUserInput
 *  UpdatedAt : 2022-07-30
 *  Description : 유저 정보를 수정하기위한 dto
 *  Content :
 *    [ Column && Field ] : name, originPwd, newPwd, phone_num, email
 * ======================================================================= */

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  originPwd: string;

  @Field(() => String)
  newPwd: string;

  @Field(() => String)
  phone_num: string;

  @Field(() => String)
  email: string;
}
