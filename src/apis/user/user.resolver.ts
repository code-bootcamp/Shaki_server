import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/auth/gql-user.param';
import { CreateUserInput } from './dto/createUser.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService, //
  ) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    const { ...userInfo } = createUserInput;
    return this.userService.create({ ...userInfo });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => String)
  fetchLoginUser(
    @CurrentUser() currentUser: any, //
  ) {
    return '로그인 정보가 확인되었습니다';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => String)
  async fetchLoginEmail(@Args('emial') email: string) {
    return await this.userService.findEmail({ email });
  }
}
