import { Field, InputType, Int } from '@nestjs/graphql';

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
