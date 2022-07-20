import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateUserInput } from './dto/createUser.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthService } from '../auth/auth.service';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService, //
    private readonly authService: AuthService,
  ) {}

  @Query(() => String)
  async findEmail(
    @Args('name') name: string,
    @Args('phone_num') phone_num: string, //
  ) {
    return await this.userService.findEmail({ name, phone_num });
  }

  @Query(() => User)
  async fetchLoginUser(
    @Context() context: any, //
  ) {
    const email = await this.authService.accessTokenCheck({ context });
    return await this.userService.findOne({ email });
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    const { pwd, ...userInfo } = createUserInput;
    const hashedPwd = await bcrypt.hash(pwd, 10);
    return this.userService.create({ hashedPwd, ...userInfo });
  }

  @Mutation(() => User)
  async createPick(
    @Context() context: any,
    @Args('roomId') room: string, //
  ) {
    const email = await this.authService.accessTokenCheck({ context });
    return await this.userService.createPick({ email, room });
  }

  @Mutation(() => User)
  async deletePick(
    @Context() context: any,
    @Args('roomId') room: string, //
  ) {
    const email = await this.authService.accessTokenCheck({ context });
    return await this.userService.deletePick({ email, room });
  }

  @Mutation(() => Boolean)
  async findPwd(
    @Args('email') email: string,
    @Args('name') name: string,
    @Args('phone_num') phone_num: string, //
  ) {
    const content = await this.userService.findPwd({ email, name, phone_num });
    const title = 'Shaki 임시 비밀번호';
    const result = await this.authService.sendEmail({
      title,
      content,
      email,
      replyContent: null,
    });
    if (result) return true;
    return false;
  }
}
