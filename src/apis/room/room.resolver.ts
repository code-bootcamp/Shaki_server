import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoomService } from './room.service';
import { CreateRoomInput } from './dto/createBranch.input';
import { Room } from './entities/room.entity';

@Resolver()
export class RoomResolver {
  constructor(
    private readonly roomService: RoomService, //
  ) {}

  @Query(() => [Room])
  async fetchRooms() {
    return await this.roomService.find();
  }

  @Query(() => Room)
  async fetchRoom(
    @Args('id') id: string, //
  ) {
    return await this.roomService.findOne({ id });
  }

  @Mutation(() => Boolean)
  async createRoom(
    @Args('createBranch') createRoomInput: CreateRoomInput, //
  ) {
    const result = await this.roomService.create({ createRoomInput });
    if (result) return true;
  }
}
