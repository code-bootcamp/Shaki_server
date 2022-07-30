import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { UpdateUserInput } from './dto/updateUser.input';
import { CreateUserInput } from './dto/createUser.input';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

/* =======================================================================
 *  TYPE : Resolver
 *  Class : UserResolver
 *  UpdatedAt : 2022-07-30
 *  Description : 유저 정보에 대한 API 설정
 *  Constructor : UserService, AuthService
 *  Content :
 *   [ Query ]
 *     findEmail      [ name: string, phone_num: string => String ]
 *                       : 아이디(이메일) 찾기를 위한 API
 *
 *     fetchLoginUser [ context: any => [User] ] : 유저 정보를 얻기위한 API
 *     fetchUserNum   [ nul => Int ] : 전체 회원수 조회
 *
 *   [ Mutation ]
 *     createUser     [ createUserInput: CreateUserInput => User ] : 유저 회원가입
 *     updateUser     [ context: any, updateUserInput: UpdateUserInput => User ]
 *                       : 유저 정보 수정 요청
 *
 *     togglePick     [ context: any, roomId: string => User ] : 유저 방에대한 찜 요청 및 취소
 *     findPwd        [ email: string, name: string, phone_num, string => Boolean ]
 *                       : 임시비밀번호 발급 API (메일 전송)
 * ======================================================================= */

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
    return this.userService.create({ pwd: hashedPwd, userInfo });
  }

  @Mutation(() => User)
  async updateUser(
    @Context() context: any,
    @Args('updateUserInput') updateUserInput: UpdateUserInput, //
  ) {
    const result = await this.authService.accessTokenCheck({ context });
    if (result) return await this.userService.update({ updateUserInput });
  }

  @Mutation(() => Boolean)
  async togglePick(
    @Context() context: any,
    @Args('roomId') roomId: string, //
  ) {
    const email = await this.authService.accessTokenCheck({ context });
    return await this.userService.togglePick({ email, room: roomId });
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
