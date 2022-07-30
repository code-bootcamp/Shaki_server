import { CreateRoomInput } from './createRoom.input';
import { InputType, PartialType } from '@nestjs/graphql';

/* =======================================================================
 *  TYPE : InputType
 *  Class : UpdateRoomInput
 *  UpdatedAt : 2022-07-30
 *  Description : 방 정보를 수정하기위한 dto
 *  Content :
 *    [ Column && Field ] : branch, name, price, remarks, contents, maxPeople,
 *                          images, tags, zipcode, address, conaddressDetail
 * ======================================================================= */

@InputType()
export class UpdateRoomInput extends PartialType(CreateRoomInput) {}
