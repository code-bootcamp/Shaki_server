import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entites/branch.entity';
import { Images } from './entites/images.entity';
import { Tags } from './entites/tags.entity';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,

    @InjectRepository(Tags)
    private readonly tagsRepository: Repository<Tags>,

    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
  ) {}

  async find() {
    return await this.branchRepository.find({
      relations: ['images', 'tags'],
    });
  }

  async create({ createBranchInput }) {
    const { tags, images, ...items } = createBranchInput;

    const branchResult = await this.branchRepository.save({
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
