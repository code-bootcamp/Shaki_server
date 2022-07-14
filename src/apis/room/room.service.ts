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

    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,

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
      relations: ['images', 'tags', 'branch', 'reviews.user'],
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

    let roomResult = await this.roomRepository.save({
      ...items,
      branch: branchResult.id,
    });

    if (branchResult.idAll === null) {
      branchResult = await this.branchRepository.save({
        ...branchResult,
        idAll: roomResult.id,
      });
    } else {
      branchResult = await this.branchRepository.save({
        ...branchResult,
        idAll: branchResult.idAll + ',' + roomResult.id,
      });
    }

    let tagsResult = [];
    for (const el of tags) {
      let tag = await this.tagsRepository.save({
        room: roomResult.id,
        tag: el,
      });

      tagsResult.push(tag);
    }

    let imagesResult = [];
    for (const el of images) {
      const url = await this.imagesRepository.save({
        room: roomResult.id,
        url: el,
      });

      imagesResult.push(url);
    }

    roomResult = await this.roomRepository.save({
      ...roomResult,
      images: imagesResult,
      tags: tagsResult,
    });

    return roomResult.id;
  }
}
