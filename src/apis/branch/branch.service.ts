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
    private readonly imagesRepository: Repository<Images>
  ) {}

  async find() {
    return await this.branchRepository.find({})
  }

  async create({ createUseditemInput }) {

   
    const { tags, images, ...items } = createUseditemInput;

    console.log(images)
    let tagsResult = [];
    tags.forEach(async el => {
      const tag = await this.tagsRepository.save({
        tag: el
      })
      tagsResult.push(tag)
    })

    let imagesResult = [];
    images.forEach(async el => {
      const url = await this.imagesRepository.save({
        url: el
      })
      imagesResult.push(url)
    })

    
    return await this.branchRepository.save({
      image: imagesResult,
      tag: tagsResult,
      ...items,
    })
  }
}