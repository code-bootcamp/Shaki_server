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
    const accessToken = context.req.headers.authorization.split(' ')[1];
    try {
      const checkToken = jwt.verify(accessToken, 'accesskey');
      const email = checkToken['email'];
      const result = await this.userService.findOne({ email });
      return result;
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
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

  @Mutation(() => Boolean)
  async findPwd(
    @Args('email') email: string,
    @Args('name') name: string,
    @Args('phone_num') phone_num: string, //
  ) {
    const content = await this.userService.findPwd({ email, name, phone_num });
    console.log('-------------------');
    console.log(content);
    console.log('-------------------');
    const title = 'Shaki 임시 비밀번호';
    const result = await this.authService.sendEmail({ title, content, email });
    if (result) return true;
    return false;
  }
}
