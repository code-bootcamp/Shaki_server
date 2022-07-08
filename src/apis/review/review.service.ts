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
    const { id, star, ...items } = createReviewInput;
    const findRoom = await this.roomRepository.findOne({ where: { id } });

    const { usedPeople, starAmount, ...etc } = findRoom;

    const starCal = ((starAmount + star) / (usedPeople + 1)).toFixed(1);

    const updatedRoom = await this.roomRepository.save({
      ...etc,
      usedPeople: usedPeople + 1,
      starAmount: starAmount + star,
      star: Number(starCal),
    });

    await this.reviewRepository.save({
      ...items,
      star,
      room: updatedRoom,
    });

    return true;
  }
}
