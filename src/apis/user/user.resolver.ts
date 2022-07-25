import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUser.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { UpdateUserInput } from './dto/updateUser.input';

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

  @Query(() => Int)
  async fetchUserNum() {
    return await this.userService.findUserNum();
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
  async updateUser(
    @Context() context: any,
    @Args('updateUserInput') updateUserInput: UpdateUserInput, //
  ) {
    const result = await this.authService.accessTokenCheck({ context });
    if (result) return await this.userService.update({ updateUserInput });
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
    if (content) {
      const title = 'Shaki 임시 비밀번호';
      const result = await this.authService.sendEmail({
        title,
        content,
        email,
        replyContent: null,
      });
      if (result) return true;
    } else {
      return false;
    }
  }
}
