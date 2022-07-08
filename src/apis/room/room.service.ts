import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { Images } from './entities/images.entity';
import { Tags } from './entities/tags.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Tags)
    private readonly tagsRepository: Repository<Tags>,

    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
  ) {}

  async find() {
    return await this.roomRepository.find({
      relations: ['images', 'tags', 'reviews'],
    });
  }

  async findOne({ id }) {
    return await this.roomRepository.findOne({
      where: { id },
      relations: ['images', 'tags', 'reviews'],
    });
  }

  async create({ createRoomInput }) {
    const { tags, images, ...items } = createRoomInput;

    const branchResult = await this.roomRepository.save({
      ...items,
    });

    let tagsResult = [];
    tags.forEach(async (el) => {
      const tag = await this.tagsRepository.save({
        branch: branchResult.id,
        tag: el,
      });
      tagsResult.push(tag);
    });

    let imagesResult = [];
    images.forEach(async (el) => {
      const url = await this.imagesRepository.save({
        branch: branchResult.id,
        url: el,
      });
      imagesResult.push(url);
    });

    return true;
  }
}
