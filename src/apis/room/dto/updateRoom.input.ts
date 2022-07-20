import { InputType, PartialType } from '@nestjs/graphql';
import { CreateRoomInput } from './createRoom.input';

@InputType()
export class UpdateRoomInput extends PartialType(CreateRoomInput) {}
