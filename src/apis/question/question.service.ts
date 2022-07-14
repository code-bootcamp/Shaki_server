import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>, //
  ) {}
  async findAll() {
    return await this.questionRepository.find();
  }

  async findOne({ id }) {
    return await this.questionRepository.findOne({ where: { id } });
  }

  async create({ createQuestionInput }) {
    return await this.questionRepository.save({ ...createQuestionInput });
  }
}
