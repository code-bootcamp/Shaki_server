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
    const { amount, ...items } = createPaymentInput;

    const findUser = await this.userRepository.findOne({
      where: { email },
      relations: ['payment'],
    });

    let paymentArray = [];
    findUser.payment.map((el) => paymentArray.push(el));

    const point = Math.round((amount - createPaymentInput.point) * 0.1);

    const result = await this.paymentRepository.save({
      ...createPaymentInput,
      room: createPaymentInput.roomId,
      user: findUser.id,
      status: '결제',
    });

    paymentArray.push(result);

    if (!findUser.payment) {
      await this.userRepository.save({
        ...findUser,
        point: findUser.point - createPaymentInput.point + point,
        payment: [result],
      });
    } else {
      await this.userRepository.save({
        ...findUser,
        point: findUser.point - createPaymentInput.point + point,
        payment: paymentArray,
      });
    }

    return result;
  }

  async findAll() {
    const result = await this.paymentRepository.find({
      relations: ['user', 'room.branch'],
    });
    return result;
  }

  async findOne({ email }) {
    return await this.paymentRepository.findOne({
      where: { id: email },
      relations: ['user', 'room.branch'],
    });
  }

  async usedTime({ id, date }) {
    const findReservation = await this.paymentRepository.find({
      where: {
        date,
        room: {
          id,
        },
      },
      relations: ['room'],
    });

    let result = [];
    findReservation.map((el) => {
      result.push(`${el.start_time} ~ ${el.end_time}`);
    });
    return result;
  }

  async cancelPayment({ impUid }) {
    const getToken = await this.iamportService.getToken();

    await axios({
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
