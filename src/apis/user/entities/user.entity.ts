import {
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Room } from 'src/apis/room/entities/room.entity';
import { Review } from 'src/apis/review/entities/review.entity';
import { Payment } from 'src/apis/payment/entities/payment.entity';

/* =======================================================================
 *  TYPE : Entity
 *  Class : User
 *  UpdatedAt : 2022-07-30
 *  Description : 리뷰에 대한 데이터를 저장하기 위한 entity
 *  Content :
 *    [ Column && Field ] : id, name, pwd, phone_num, email, point, room
 *                          payment, review
 * ======================================================================= */

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String)
  pwd: string;

  @Column({ nullable: true })
  @Field(() => String)
  phone_num: String;

  @Column()
  @Field(() => String)
  email: string;

  @Column({ default: 0, nullable: true })
  @Field(() => Int)
  point: number;

  @ManyToMany(() => Room, (room) => room.user)
  @Field(() => [Room])
  room: Room[];

  @OneToMany(() => Payment, (payment) => payment.user)
  @Field(() => [Payment])
  payment: Payment[];

  @OneToMany(() => Review, (review) => review.user)
  @Field(() => [Review])
  review: Review[];
}
