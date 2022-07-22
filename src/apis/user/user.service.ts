import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../room/entities/room.entity';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

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
      relations: ['room', 'payment', 'review'],
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
    }
  }

  async create({ hashedPwd: pwd, ...userInfo }) {
    const { ...info } = userInfo;
    const result = await this.userRepository.save({
      ...info,
      pwd,
    });
    return result;
  }

  async createPick({ email, room }) {
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

      const result = await this.userRepository.save({
        ...findUser,
        room: roomResult,
      });

      return result;
    }

    return findUser;
  }

  async deletePick({ email, room }) {
    const userResult = await this.userRepository.findOne({
      where: { email },
      relations: ['room'],
    });

    const userRoom = userResult.room.filter((el) => {
      return el.id !== room;
    });

    const result = await this.userRepository.save({
      ...userResult,
      room: userRoom,
    });

    return result;
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
