import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../room/entities/room.entity';

/* =======================================================================
 *  TYPE : Service
 *  Class : BranchService
 *  UpdatedAt : 2022-07-25
 *  Description : 지점 API에 필요한 각종 함수 설정
 *  Constructor : Repository<Room>
 *  Content :
 *    find [ null => [Room] ] : 지점별 별점 가장 높은 방 1개 조회
 * ======================================================================= */

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async find() {
    const rooms = await this.roomRepository.find({
      relations: ['images', 'tags', 'reviews', 'branch'],
    });

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
    return result;
  }
}
