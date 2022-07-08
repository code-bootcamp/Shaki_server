import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../room/entities/room.entity';
import { Review } from './entities/review.entity';

@Injectable()
export class ReivewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async create({ createReviewInput }) {
    const { id, ...items } = createReviewInput;
    const room = await this.roomRepository.findOne({ where: { id } });

    await this.reviewRepository.save({
      ...items,
      room,
    });

    return true;
  }
}
