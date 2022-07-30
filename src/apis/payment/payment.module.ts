import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { PaymentService } from './payment.service';
import { AuthService } from '../auth/auth.service';
import { Room } from '../room/entities/room.entity';
import { User } from '../user/entities/user.entity';
import { Payment } from './entities/payment.entity';
import { PaymentResolver } from './payment.resolver';
import { IamportService } from '../iamport/iamport.service';

/* =======================================================================
 *  TYPE : Module
 *  Class : PaymentModule
 *  UpdatedAt : 2022-07-28
 *  Description : 결제 API에 필요한 각종 파일 설정
 *  Imports : Entity[ Payment, Room, User ]
 *  Providers : [
 *    PaymentResolver, PaymentService, IamportService, UserService,
 *    AuthService, JwtService
 *  ]
 * ======================================================================= */

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
