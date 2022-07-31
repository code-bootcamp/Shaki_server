import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../room/entities/room.entity';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';

/* =======================================================================
 *  TYPE : Service
 *  Class : UserService
 *  UpdatedAt : 2022-07-31
 *  Description : 방 API에 필요한 각종 함수 설정
 *  Constructor : Repository<User, Room>
 *  Content :
 *    findOne      [ email: string => User ] : 특정 유저정보 한명의 데이터 조회
 *    findPwd      [ email: string, phone_num: string, name: string => Boolean || String ]
 *                     : 임시 비밀번호 발금 함수(메일 전송)
 *
 *    create       [ pwd: string, userInfo: CreateUserInput (without pwd) => User ]
 *                     : 회원가입 API
 *
 *    togglePick   [ email: string, room: string  => Boolean ] : 유저 찜 요청 및 취소
 *    findEmail    [ name: string, phone_num: string => String ] : 유저 아이디 찾기 함수
 *    findUserNum  [ null => Int ] : 유저 전체 회원 수 조회
 *    update       [ updateUserInput: UpdateUserInput => User ]
 *                     : 회원 정보 수정 함수
 * ======================================================================= */

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, //

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async findOne({ email }) {
    const result = await this.userRepository.findOne({
      where: { email },
      relations: ['room.images', 'payment.room.images', 'review'],
    });
    return result;
  }

  async findPwd({ email, phone_num, name }) {
    const findUser = await this.userRepository.findOne({
      where: { email },
    });

    if (
      findUser.email === email &&
      findUser.name === name &&
      findUser.phone_num === phone_num
    ) {
      const tempPwd = Math.random().toString(36).slice(2);
      const hashedPwd = await bcrypt.hash(tempPwd, 10);

      await this.userRepository.save({
        ...findUser,
        pwd: hashedPwd,
      });

      return tempPwd;
    } else {
      return false;
    }
  }

  async create({ pwd, userInfo }) {
    return await this.userRepository.save({
      ...userInfo,
      pwd,
    });
  }

  async togglePick({ email, room }) {
    const findRoom = await this.roomRepository.find({
      where: { id: room },
    });
    const findUser = await this.userRepository.findOne({
      where: { email },
      relations: ['room'],
    });

    let flag = true;
    findUser.room.forEach((el) => {
      if (el.id === room) {
        flag = false;
      }
    });

    if (flag) {
      const roomResult = [...findRoom, ...findUser.room];

      await this.userRepository.save({
        ...findUser,
        room: roomResult,
      });
      return true;
    } else {
      const roomResult = findUser.room.filter((el) => el.id !== room);

      await this.userRepository.save({
        ...findUser,
        room: roomResult,
      });
      return false;
    }
  }

  async findEmail({ name, phone_num }) {
    const result = await this.userRepository.findOne({
      where: { name },
    });

    if (name === result.name && phone_num === result.phone_num) {
      return result.email;
    }

    return '불일치';
  }

  async findUserNum() {
    return await this.userRepository.count();
  }

  async update({ updateUserInput }) {
    try {
      const { originPwd, newPwd, ...items } = updateUserInput;

      const findUser = await this.userRepository.findOne({
        where: { email: updateUserInput.email },
      });

      const isAuth = await bcrypt.compare(originPwd, findUser.pwd);
      if (isAuth) {
        const hashedPwd = await bcrypt.hash(newPwd, 10);

        return await this.userRepository.save({
          ...findUser,
          ...items,
          pwd: hashedPwd,
        });
      } else {
        throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다.');
      }
    } catch {
      throw new UnprocessableEntityException();
    }
  }
}
