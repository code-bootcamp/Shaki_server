import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Question } from './entities/question.entity';

/* =======================================================================
 *  TYPE : Service
 *  Class : QuestionService
 *  UpdatedAt : 2022-07-28
 *  Description : 질문 API에 필요한 각종 함수 설정
 *  Constructor : Repository<Question, User>
 *  Content :
 *    findAll   [ null => [Question] ] : 전체 질문 내용 조회 함수
 *    findOne   [ id: string => Question ] : 특정 질문 한개 조회 함수
 *    create    [ createQuestionInput: CreateQuestionInput => Question ]
 *                        : 질문 저장 함수
 * ======================================================================= */

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
