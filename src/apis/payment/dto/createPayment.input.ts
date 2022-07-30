import { Field, InputType, Int } from '@nestjs/graphql';

/* =======================================================================
 *  TYPE : InputType
 *  Class : CreatePaymentInput
 *  UpdatedAt : 2022-07-30
 *  Description : 결제 정보를 받아오기위한 dto
 *  Content :
 *    [ Column && Field ] : roomId, impUid, date, start_time, end_time, point,
 *                          amount, guest
 * ======================================================================= */

@InputType()
export class CreatePaymentInput {
  @Field(() => String)
  roomId: string;

  @Field(() => String)
  impUid: string;

  @Field(() => String)
  date: string;

  @Field(() => String)
  start_time: string;

  @Field(() => String)
  end_time: string;

  @Field(() => Int)
  point: number;

  @Field(() => Int)
  amount: number;

  @Field(() => Int)
  guest: number;
}
