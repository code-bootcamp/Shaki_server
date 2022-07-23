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
  async find({ pageNum, roomId }) {
    let skip = 0;
    if (skip !== 1) skip = (pageNum - 1) * 10;
    const result = await this.reviewRepository.find({
      relations: ['room', 'user'],
      where: { room: { id: roomId } },
      order: { createAt: 'DESC' },
      skip,
      take: 10,
    });

    return result;
  }

  async create({ email, createReviewInput }) {
    const { roomId, star, ...items } = createReviewInput;

    const findRoom = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['images', 'tags', 'reviews', 'branch'],
    });

    const findUser = await this.userRepository.findOne({
      where: { email },
    });

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

  async delete({ reviewId }) {
    const findReview = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['room'],
    });

    const findRoom = await this.roomRepository.findOne({
      where: { id: findReview.room.id },
      relations: ['reviews'],
    });

    const starAmountResult = findRoom.starAmount - findReview.star;

    const usedPeopleResult = findRoom.usedPeople - 1;

    let starResult;
    if (starAmountResult !== 0 && usedPeopleResult !== 0) {
      starResult = (starAmountResult / usedPeopleResult).toFixed(1);
    } else {
      starResult = 0;
    }

    await this.roomRepository.save({
      ...findRoom,
      star: Number(starResult),
      starAmount: starAmountResult,
      usedPeople: usedPeopleResult,
    });

    await this.reviewRepository.softDelete({
      id: reviewId,
    });

    return true;
  }

  async update({ reviewId, star, content }) {
    const findReview = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['room'],
    });

    const findRoom = await this.roomRepository.findOne({
      where: { id: findReview.room.id },
      relations: ['reviews'],
    });

    const starAmountResult =
      findRoom.starAmount + (findReview.star - findRoom.star);

    const usedPeopleResult = findRoom.usedPeople;

    const starResult = (starAmountResult / usedPeopleResult).toFixed(1);

    await this.reviewRepository.save({
      ...findReview,
      content,
      star: Number(starResult),
      starAmount: starAmountResult,
      usedPeople: usedPeopleResult,
    });

    return true;
  }
}
