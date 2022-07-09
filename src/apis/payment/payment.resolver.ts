import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePaymentInput } from './dto/createPayment.input';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService, //
  ) {}

  @Mutation(() => Payment)
  createPayment(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput, //
  ) {
    return this.paymentService.create({ createPaymentInput });
  }

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
}
