import { PaymentService } from './payment.service';
import { AuthService } from '../auth/auth.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput } from './dto/createPayment.input';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

/* =======================================================================
 *  TYPE : Resolver
 *  Class : PaymentResolver
 *  UpdatedAt : 2022-07-28
 *  Description : 결제에 대한 API 설정
 *  Constructor : PaymentService, AuthService
 *  Content :
 *   [ Query ]
 *     fetchPayments      [ null => [Payment] ] : 결제내역 전체 조회
 *     fetchPayment       [ email: string => Payment ] : 특정 결제내역 1개 조회
 *     fetchReservation   [ email: string, date: string => [String] ]
 *                            : 회원가입을 위한 이메일 체크
 *     fetchPaymentSum    [ null => Int  ] : AccessToken 재발급
 *
 *   [ Mutation ]
 *     createPayment      [ createPaymentInput: CreatePaymentInput => Payment ]
 *                            : 결제내역 데이터 저장
 *
 *     cancelPayment      [ impUid: string => Boolean ] : 결제 환불 API
 * ======================================================================= */

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

  @Query(() => Int)
  async fetchPaymentSum() {
    return this.paymentService.findSum();
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
