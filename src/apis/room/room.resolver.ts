import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoomService } from './room.service';
import { CreateRoomInput } from './dto/createRoom.input';
import { Room } from './entities/room.entity';
import { UpdateRoomInput } from './dto/updateRoom.input';

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

  @Query(() => [Room])
  async fetchRooms() {
    return await this.roomService.findAll();
  }

  @Mutation(() => String)
  async createRoom(
    @Args('createRoom') createRoomInput: CreateRoomInput, //
  ) {
    return await this.roomService.create({ createRoomInput });
  }

  @Mutation(() => Boolean)
  async deleteRoom(
    @Args('roomId') roomId: string, //
  ) {
    return await this.roomService.delete({ roomId });
  }

  @Mutation(() => Room)
  async updateRoom(
    @Args('roomId') roomId: string, //
    @Args('updateRoomInput') updateRoomInput: UpdateRoomInput,
  ) {
    return await this.roomService.update({ roomId, updateRoomInput });
  }
}
