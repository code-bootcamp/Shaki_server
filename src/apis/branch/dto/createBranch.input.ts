import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBranchInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  address: string;

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  people: number;

  @Field(() => String)
  description: string;

  @Field(() => String)
  tags: string;
}
