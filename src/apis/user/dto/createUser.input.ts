import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  nickname: string;

  @Field(() => String)
  pwd: string;

  @Field(() => String)
  phone_num: string;

  @Field(() => String)
  email: string;
}
