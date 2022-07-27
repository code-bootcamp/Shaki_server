import { Test } from '@nestjs/testing';
import { BranchResolver } from '../branch.resolver';
import { BranchService } from '../branch.service';

class MockBranchService {
  find() {
    return [
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
  }
}
describe('BranchResolver', () => {
  let branchResolver: BranchResolver;

  beforeEach(async () => {
    const branchmodule = await Test.createTestingModule({
      providers: [
        BranchResolver,
        {
          provide: BranchService,
          useClass: MockBranchService,
        },
      ],
    }).compile();

    branchResolver = branchmodule.get<BranchResolver>(BranchResolver);
  });

  describe('', () => {
    it('fetchBranches', async () => {
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

      const result = await branchResolver.fetchBranches();
      expect(result).toStrictEqual(checkData);
    });
  });
});
