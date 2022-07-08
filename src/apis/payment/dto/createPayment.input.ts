import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePaymentInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  buyer: string;

  @Field(() => String)
  type: string;

  @Field(() => String)
  branch_name: string;

  @Field(() => String)
  use_time: string;

  @Field(() => Int)
  amount: number;
}
