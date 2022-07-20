import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';
import { CreateQuestionInput } from './dto/createQuestion.input';
import { ReplyQuestionInput } from './dto/replyQestion.input';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';

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
    @Args('createQuestionInput') replyQuestionInput: ReplyQuestionInput,
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
