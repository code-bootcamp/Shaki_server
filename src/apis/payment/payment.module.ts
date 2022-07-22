import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { IamportService } from '../iamport/iamport.service';
import { Room } from '../room/entities/room.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Payment } from './entities/payment.entity';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Room,
      Payment, //
      User,
    ]),
  ],
  providers: [
    PaymentResolver, //
    PaymentService,
    IamportService,
    UserService,
    AuthService,
    JwtService,
  ],
})
export class PaymentModule {}
