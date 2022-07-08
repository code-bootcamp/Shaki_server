import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, //
  ) {}

  async create({ hashedPwd: pwd, ...userInfo }) {
    const { ...info } = userInfo;
    const result = await this.userRepository.save({
      ...info,
      pwd,
    });
    return result;
  }

  async findOne({ email }) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }
}
