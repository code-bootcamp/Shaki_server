import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entites/branch.entity';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>
  ) {}

  async find() {
    return await this.branchRepository.find({})
  }

  async create({ createBranchInput }) {
    return await this.branchRepository.save({
      ...createBranchInput,
    })
  }
}