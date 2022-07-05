import { Field, InputType, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateBranchInput {
  @Field(() => String)
  name: string;

  @Field(() => Int)
  price: number;

  @Field(() => String)
  contents: string;

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

  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  lng: number;
}
