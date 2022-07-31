import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Branch } from 'src/apis/branch/entities/branch.entity';
import { FileService } from 'src/apis/file/file.service';
import { Room } from 'src/apis/room/entities/room.entity';
import { Images } from '../entities/images.entity';
import { Tags } from '../entities/tags.entity';
import { RoomService } from '../room.service';

class MockRoomRepository {
  data = [
    {
      id: '1',
      name: '1번방',
    },
    {
      id: '2',
      name: '2번방',
    },
  ];

  find() {
    return this.data;
  }
}

class MockTagsRepository {}
class MockBranchRepository {}
class MockImagesRepository {}

describe('BranchService', () => {
  let roomService: RoomService;

  beforeEach(async () => {
    const roomModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Room),
          useClass: MockRoomRepository,
        },
        {
          provide: getRepositoryToken(Tags),
          useClass: MockTagsRepository,
        },
        {
          provide: getRepositoryToken(Branch),
          useClass: MockBranchRepository,
        },
        {
          provide: getRepositoryToken(Images),
          useClass: MockImagesRepository,
        },
        FileService,
        RoomService,
      ],
    }).compile();

    roomService = roomModule.get<RoomService>(RoomService);
  });

  describe('find', () => {
    it('방 전체 데이터 조회', async () => {
      const rooms = [
        {
          id: '1',
          name: '1번방',
        },
        {
          id: '2',
          name: '2번방',
        },
      ];

      const result = await roomService.findAll();
      expect(result).toStrictEqual(rooms);
    });
  });
});
