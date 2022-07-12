import { Field, InputType, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateRoomInput {
  @Field(() => String)
  branch: string;

  @Field(() => String)
  remarks: string;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  price: number;

  @Field(() => String)
  contents: string;

  @Field(() => Int)
  maxPeople: number;

  @Field(() => [String])
  images: string[];

  @Field(() => [String])
  tags: string[];

  @Field(() => String)
  zipcode: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  conaddressDetail: string;
}
