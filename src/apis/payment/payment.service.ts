import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>, //

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({ createPaymentInput }) {
    return await this.paymentRepository.save({ ...createPaymentInput });
  }

  async findAll() {
    return await this.paymentRepository.find({
      relations: ['user'],
    });
  }

  async findOne({ email }) {
    return await this.paymentRepository.findOne({
      where: { id: email },
      relations: ['user'],
    });
  }
}
