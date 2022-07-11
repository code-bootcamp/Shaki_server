import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { Images } from './entities/images.entity';
import { Tags } from './entities/tags.entity';
import { Branch } from '../branch/entities/branch.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Tags)
    private readonly tagsRepository: Repository<Tags>,

    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,

    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async find() {
    return await this.roomRepository.find({
      relations: ['images', 'tags', 'reviews', 'branch'],
    });
  }

  async findOne({ id }) {
    return await this.roomRepository.findOne({
      where: { id },
      relations: ['images', 'tags', 'reviews', 'branch'],
    });
  }

  async create({ createRoomInput }) {
    const { tags, images, branch, ...items } = createRoomInput;

    let branchResult = await this.branchRepository.findOne({
      where: { branch },
    });

    if (!branchResult) {
      branchResult = await this.branchRepository.save({
        branch,
      });
    }

    const roomResult = await this.roomRepository.save({
      ...items,
      branch: branchResult,
    });

    let tagsResult = [];
    tags.forEach(async (el) => {
      const tag = await this.tagsRepository.save({
        room: roomResult.id,
        tag: el,
      });
      tagsResult.push(tag);
    });

    let imagesResult = [];
    images.forEach(async (el) => {
      const url = await this.imagesRepository.save({
        room: roomResult.id,
        url: el,
      });
      imagesResult.push(url);
    });

    return roomResult.id;
  }
}
