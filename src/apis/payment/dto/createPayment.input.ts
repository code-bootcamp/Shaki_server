import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePaymentInput {
  @Field(() => String)
  roomId: string;

  @Field(() => String)
  date: string;

  @Field(() => String)
  start_time: string;

  @Field(() => String)
  end_time: string;

  @Field(() => Int)
  amount: number;

  @Field(() => Int)
  guest: number;
}
