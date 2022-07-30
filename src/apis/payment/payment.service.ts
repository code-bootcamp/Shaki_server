import axios from 'axios';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Payment } from './entities/payment.entity';
import { IamportService } from '../iamport/iamport.service';

/* =======================================================================
 *  TYPE : Service
 *  Class : PaymentService
 *  UpdatedAt : 2022-07-28
 *  Description : 권한 API에 필요한 각종 함수 설정
 *  Constructor : Repository<Payment, User>, IamportService
 *  Content :
 *    create    [ createPaymentInput: CreatePaymentInput, => Payment ]
 *                  : 결제 내역 저장 함수
 *
 *    findAll   [ null => [Payment] ] : 젠체 결제내역 조회 함수
 *    findOne   [ email: string => Payment ] : 특정 결제내역 한개 조회 함수
 *    usedTime  [ id: string, date: string => [String] ] : 날짜별 예약 시간조회
 *    cancelPayment   [ impUid: string => Boolean ] : 결제내역 환불 요청
 *    findSum   [ null => Int ] : 결제 금액 총 합계 조회
 * ======================================================================= */

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

    let pointResult = findUser.point - createPaymentInput.point + point;
    if (pointResult < 0) {
      pointResult = 0;
    }

    if (!findUser.payment) {
      await this.userRepository.save({
        ...findUser,
        point: pointResult,
        payment: [result],
      });
    } else {
      await this.userRepository.save({
        ...findUser,
        point: pointResult,
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

    await this.paymentRepository.softDelete;

    return true;
  }

  async findSum() {
    const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(amount)', 'sum')
      .where({ status: '결제' })
      .getRawMany();

    return Number(result[0].sum);
  }
}
