import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/auth/gql-user.param';
import { CreateUserInput } from './dto/createUser.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { Room } from '../room/entities/room.entity';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService, //
  ) {}

  @Query(() => User)
  async fetchLoginUser(@Args('email') email: string) {
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
    @Args('email') email: string,
    @Args('roomId') room: string, //
  ) {
    return await this.userService.createPick({ email, room });
  }

  @Query(() => String)
  async findEmail(
    @Args('name') name: string,
    @Args('phone_num') phone_num: string, //
  ) {
    return await this.userService.findEmail({ name, phone_num });
  }
}
