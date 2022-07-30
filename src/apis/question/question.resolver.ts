import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';
import { CreateQuestionInput } from './dto/createQuestion.input';
import { ReplyQuestionInput } from './dto/replyQestion.input';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';

/* =======================================================================
 *  TYPE : Resolver
 *  Class : QuestionResolver
 *  UpdatedAt : 2022-07-28
 *  Description : 질문에 대한 API 설정
 *  Constructor : QuestionService, AuthService
 *  Content :
 *   [ Query ]
 *     fetchQuestions     [ null => [Question] ] : 전체 질문 내용 조회
 *     fetchQuestion      [ id: string => Question ] : 특정 질문 내용 1개 조회
 *
 *   [ Mutation ]
 *     createQuestion     [ createQuestionInput: CreateQuestionInput => Question ]
 *                              : 질문 내용 저장 API
 *     replyQuestion      [ replyQuestionInput: ㄲeplyQuestionInput => Boolean ]
 *                              : 질문에 대한 답변 메일 전송 API
 * ======================================================================= */

@Resolver()
export class QuestionResolver {
  constructor(
    private readonly questionService: QuestionService, //
    private readonly authService: AuthService,
  ) {}

  @Query(() => [Question])
  async fetchQuestions() {
    return await this.questionService.findAll();
  }

  @Query(() => Question)
  async fetchQuestion(
    @Args('id') id: string, //
  ) {
    return await this.questionService.findOne({ id });
  }

  @Mutation(() => Question)
  async createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ) {
    return await this.questionService.create({ createQuestionInput });
  }

  @Mutation(() => Boolean)
  async replyQuestion(
    @Args('replyQuestionInput') replyQuestionInput: ReplyQuestionInput,
  ) {
    const title = 'asdasd';
    await this.authService.sendEmail({
      title,
      email: replyQuestionInput.email,
      content: replyQuestionInput.content,
      replyContent: replyQuestionInput.replyContent,
    });

    return true;
  }
}
