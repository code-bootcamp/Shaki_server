import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { Images } from './entities/images.entity';
import { Tags } from './entities/tags.entity';
import { Branch } from '../branch/entities/branch.entity';
import { FileService } from '../file/file.service';

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

    private readonly fileService: FileService,
  ) {}

  async find() {
    return await this.roomRepository.find({
      relations: ['images', 'tags', 'reviews'],
    });
  }

  async findAll() {
    return await this.roomRepository.find({
      relations: ['images', 'tags', 'reviews', 'branch'],
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

  async delete({ roomId }) {
    const findRoom = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['user', 'tags', 'images'],
    });

    findRoom.tags.map(async (el) => {
      await this.tagsRepository.softDelete({
        id: el.id,
      });
    });

    findRoom.images.map(async (el) => {
      await this.fileService.remove({ imageUrl: el.url });
    });

    findRoom.images.map(async (el) => {
      await this.imagesRepository.softDelete({
        id: el.id,
      });
    });

    await this.roomRepository.softDelete({
      id: roomId,
    });

    return true;
  }

  async update({ roomId, updateRoomInput }) {
    const { tags, images, branch, ...items } = updateRoomInput;
    const roomResult = await this.roomRepository.findOne({
      relations: ['images', 'tags', 'branch'],
      where: { id: roomId },
    });

    roomResult.tags.map(async (el) => {
      await this.tagsRepository.delete({
        id: el.id,
      });
    });

    tags.map(async (el) => {
      await this.tagsRepository.save({
        tag: el,
        room: roomResult,
      });
    });

    const tagsResult = await this.tagsRepository.find({
      relations: ['room'],
      where: { room: { id: roomId } },
    });

    let originImages = roomResult.images;
    let newImages = images;

    let flag = false;

    for (let i = 0; i < newImages.length; i++) {
      for (let j = 0; j < originImages.length; j++) {
        if (newImages[i] === originImages[j].url) {
          flag = true;
        }
      }
      if (!flag) {
        await this.imagesRepository.save({
          room: roomId,
          url: newImages[i],
        });
      }

      flag = false;
    }

    const imageResult = await this.imagesRepository.find({
      relations: ['room'],
      where: { room: { id: roomId } },
    });

    let branchResult;
    if (branch !== roomResult.branch) {
      branchResult = await this.branchRepository.findOne({
        where: { branch },
      });

      const originBranch = await this.branchRepository.findOne({
        where: { branch: roomResult.branch.branch },
      });

      if (originBranch.idAll.split(',').length >= 1) {
        await this.branchRepository.save({
          ...originBranch,
          idAll: originBranch.idAll
            .split(',')
            .filter((el) => el !== roomResult.id)
            .join(','),
        });
      }

      if (!branchResult) {
        branchResult = await this.branchRepository.save({
          branch,
          idAll: roomResult.id,
        });
      } else {
        branchResult = await this.branchRepository.save({
          ...branchResult,
          idAll: branchResult.idAll + ',' + roomResult.id,
        });
      }
    }

    const result = await this.roomRepository.save({
      id: roomResult.id,
      ...items,
      images: imageResult,
      tags: tagsResult,
      branch: branchResult.id,
    });

    return result;
  }
}
