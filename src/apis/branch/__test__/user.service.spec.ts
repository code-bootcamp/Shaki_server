import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from 'src/apis/room/entities/room.entity';
import { BranchService } from '../branch.service';

class MockRoomRepository {
  roomdb = [
    {
      images: {
        url: ['이미지1', '이미지2'],
      },
      branch: {
        branch: '신도림점',
      },
      contents: '아늑한 분위기',
      star: 2.4,
    },
    {
      images: {
        url: ['이미지1', '이미지2'],
      },
      branch: {
        branch: '신도림점',
      },
      contents: '아늑한 분위기',
      star: 5.0,
    },
    {
      images: {
        url: ['이미지3', '이미지4'],
      },
      branch: {
        branch: '사당역점',
      },
      contents: '아늑한 분위기',
      star: 3.4,
    },
    {
      images: {
        url: ['이미지3', '이미지4'],
      },
      branch: {
        branch: '사당역점',
      },
      contents: '아늑한 분위기',
      star: 3.0,
    },
  ];

  find() {
    return this.roomdb;
  }
}

describe('BranchService', () => {
  let brachService: BranchService;

  beforeEach(async () => {
    const brachModule = await Test.createTestingModule({
      providers: [
        BranchService,
        {
          provide: getRepositoryToken(Room),
          useClass: MockRoomRepository,
        },
      ],
    }).compile();

    brachService = brachModule.get<BranchService>(BranchService);
  });

  describe('find', () => {
    it('지점별 별점 높은 방 1개 조회', async () => {
      const checkData = [
        {
          images: {
            url: ['이미지1', '이미지2'],
          },
          branch: {
            branch: '신도림점',
          },
          contents: '아늑한 분위기',
          star: 5.0,
        },
        {
          images: {
            url: ['이미지3', '이미지4'],
          },
          branch: {
            branch: '사당역점',
          },
          contents: '아늑한 분위기',
          star: 3.4,
        },
      ];

      const rooms = await brachService.find();

      let branch = new Map();
      let result = [];
      rooms.forEach((el) => {
        if (!branch.has(el.branch.branch)) {
          result.push(el);
          branch.set(el.branch.branch, result.length - 1);
        } else {
          const saveStar = result[branch.get(el.branch.branch)].star;
          const currentStar = el.star;
          if (currentStar > saveStar) result[branch.get(el.branch.branch)] = el;
        }
      });

      expect(checkData).toStrictEqual(result);
    });
  });
});
