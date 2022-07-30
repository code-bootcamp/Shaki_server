import { RoomService } from './room.service';
import { Room } from './entities/room.entity';
import { UpdateRoomInput } from './dto/updateRoom.input';
import { CreateRoomInput } from './dto/createRoom.input';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

/* =======================================================================
 *  TYPE : Resolver
 *  Class : RoomResolver
 *  UpdatedAt : 2022-07-30
 *  Description : 지점별 방에 대한 API 설정
 *  Constructor : RoomService
 *  Content :
 *   [ Query ]
 *     fetchRoom   [ id: string => Room ] : 특정 방 한개 데이터 조회
 *     fetchRooms  [ null => [Room] ] : 방 전체 데이터 조회
 *
 *   [ Mutation ]
 *     createRoom  [ createRoomInput: CreateRoomInput => String ]
 *                      : 방 데이터 추가 요청
 *
 *     deleteRoom  [ roomId: stirng => Boolean ] : 특정 방 데이터 삭제(softDelete)
 *     updateRoom  [ roomId: string, updateRoomInput: UpdateRoomInput => Room ]
 *                      : 특정 방 데티터 수정 요청
 *
 * ======================================================================= */

@Resolver()
export class RoomResolver {
  constructor(
    private readonly roomService: RoomService, //
  ) {}

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
    @Args('createRoomInput') createRoomInput: CreateRoomInput, //
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
