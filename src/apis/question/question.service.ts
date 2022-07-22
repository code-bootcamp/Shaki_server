import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>, //
  ) {}
  async findAll() {
    return await this.questionRepository.find();
  }

  async findOne({ id }) {
    return await this.questionRepository.findOne({ where: { id } });
  }

  async create({ createQuestionInput }) {
    const { email, ...items } = createQuestionInput;

    let userResult = await this.userRepository.findOne({
      where: { email },
    });

    let questionResult;
    if (userResult) {
      questionResult = await this.questionRepository.save({
        ...createQuestionInput,
        user: userResult.id,
      });
    } else {
      questionResult = await this.questionRepository.save({
        ...createQuestionInput,
      });
    }

    return questionResult;
  }
}
