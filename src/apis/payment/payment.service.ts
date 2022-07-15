import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IamportService } from '../iamport/iamport.service';
import { User } from '../user/entities/user.entity';
import { Payment } from './entities/payment.entity';
import axios from 'axios';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>, //

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly iamportService: IamportService,
  ) {}

  async create({ createPaymentInput, email }) {
    const findUser = await this.userRepository.findOne({
      where: { email },
    });

    const result = await this.paymentRepository.save({
      ...createPaymentInput,
      room: createPaymentInput.roomId,
      user: findUser.id,
      status: '결제',
    });

    return result;
  }

  async findAll() {
    const result = await this.paymentRepository.find({
      relations: ['user', 'room'],
    });
    return result;
  }

  async findOne({ email }) {
    return await this.paymentRepository.findOne({
      where: { id: email },
      relations: ['user'],
    });
  }

  async usedTime({ id, date }) {
    return await this.paymentRepository.find({
      where: {
        date,
        room: {
          id,
        },
      },
      relations: ['room'],
    });
  }

  async cancelPayment({ impUid }) {
    const getToken = await this.iamportService.getToken();
    console.log(getToken);
    const getCancelData = await axios({
      url: 'https://api.iamport.kr/payments/cancel',
      method: 'post',
      headers: {
        Authorization: getToken,
      },
      data: {
        imp_uid: impUid,
      },
    });

    return true;
  }
}
