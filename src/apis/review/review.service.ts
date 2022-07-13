import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../room/entities/room.entity';
import { User } from '../user/entities/user.entity';
import { Review } from './entities/review.entity';

@Injectable()
export class ReivewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({ email, createReviewInput }) {
    const { roomId, star, ...items } = createReviewInput;

    const findRoom = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['images', 'tags', 'reviews', 'branch'],
    });

    const findUser = await this.userRepository.findOne({
      where: { email },
    });

    console.log(findUser);

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
      user: findUser,
    });

    return true;
  }
}
