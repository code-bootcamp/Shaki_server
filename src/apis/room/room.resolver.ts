import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoomService } from './room.service';
import { CreateRoomInput } from './dto/createRoom.input';
import { Room } from './entities/room.entity';

@Resolver()
export class RoomResolver {
  constructor(
    private readonly roomService: RoomService, //
  ) {}

  @Query(() => [Room])
  async fetchBranches() {
    return await this.roomService.find();
  }

  @Query(() => Room)
  async fetchRoom(
    @Args('id') id: string, //
  ) {
    return await this.roomService.findOne({ id });
  }

  @Mutation(() => String)
  async createRoom(
    @Args('createRoom') createRoomInput: CreateRoomInput, //
  ) {
    return await this.roomService.create({ createRoomInput });
  }
}
