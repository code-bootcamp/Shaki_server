import { Field, InputType, Int, Float } from '@nestjs/graphql';

/* =======================================================================
 *  TYPE : InputType
 *  Class : CreateRoomInput
 *  UpdatedAt : 2022-07-30
 *  Description : 방 정보를 받아오기위한 dto
 *  Content :
 *    [ Column && Field ] : branch, name, price, remarks, contents, maxPeople,
 *                          images, tags, zipcode, address, conaddressDetail
 * ======================================================================= */

@InputType()
export class CreateRoomInput {
  @Field(() => String)
  branch: string;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  price: number;

  @Field(() => String)
  remarks: string;

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
