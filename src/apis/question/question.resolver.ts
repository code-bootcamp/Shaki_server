import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateQuestionInput } from './dto/createQuestion.input';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';

@Resolver()
export class QuestionResolver {
  constructor(
    private readonly questionService: QuestionService, //
  ) {}

  @Query(() => [Question])
  async fetchQuestions() {
    return await this.questionService.findAll();
  }

  @Mutation(() => Question)
  async createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ) {
    return await this.questionService.create({ createQuestionInput });
  }
}
