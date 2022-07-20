import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Payment } from 'src/apis/payment/entities/payment.entity';
import { Room } from 'src/apis/room/entities/room.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}
