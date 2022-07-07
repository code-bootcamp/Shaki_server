// import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { Request, Response } from 'express';
// import { User } from '../user/entities/user.entity';
// import { UserService } from '../user/user.service';
// import { AuthService } from './auth.service';
// import * as bcrypt from 'bcrypt';

// interface IQAuthUser {
//   user: Pick<User, 'email' | 'name' | 'pwd' | 'phone_num' | 'nickname'>;
// }

// @Controller()
// export class AuthController {
//   constructor(
//     private readonly userService: UserService, //
//     private readonly authService: AuthService,
//   ) {}
//   @Get('/login/google')
//   @UseGuards(AuthGuard('google'))
//   async loginGoogle(@Req() req: Request & IQAuthUser, @Res() res: Response) {
//     let user = await this.userService.findOne({ email: req.user.email });
//     const hashedPwd = await bcrypt.hash(req.user.pwd, 10);
//     if (!user) {
//       user = await this.userService.create({
//         email: req.user.email,
//         hashedPwd,
//         name: req.user.name,
//         nickname: req.user.nickname,
//         phone_num: req.user.phone_num,
//       });
//     }
//     console.log(res);
//     this.authService.getRefreshToKen({ user, res });
//     res.redirect('http://localhost:3000/result.html');
//   }
// }
