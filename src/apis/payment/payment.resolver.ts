import { UnauthorizedException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePaymentInput } from './dto/createPayment.input';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';
import * as jwt from 'jsonwebtoken';
import { AuthService } from '../auth/auth.service';
@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService, //
    private readonly authService: AuthService,
  ) {}
  @Query(() => [Payment])
  async fetchPayments() {
    return await this.paymentService.findAll();
  }

  @Query(() => Payment)
  async fetchPayment(
    @Args('email') email: string, //
  ) {
    return await this.paymentService.findOne({ email });
  }

  @Query(() => [String])
  async fetchReservation(
    @Args('room') id: string,
    @Args('date') date: string, //
  ) {
    return this.paymentService.usedTime({ id, date });
  }

  @Mutation(() => Payment)
  async createPayment(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput, //
    @Context() context: any,
  ) {
    const email = await this.authService.accessTokenCheck({ context });
    return await this.paymentService.create({ createPaymentInput, email });
  }

  @Mutation(() => Boolean)
  cancelPayment(
    @Args('impUid') impUid: string, //
  ) {
    return this.paymentService.cancelPayment({ impUid });
  }
}
