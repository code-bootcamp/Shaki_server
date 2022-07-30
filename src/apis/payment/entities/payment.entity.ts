import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Room } from 'src/apis/room/entities/room.entity';
import { User } from 'src/apis/user/entities/user.entity';

/* =======================================================================
 *  TYPE : Entity
 *  Class : Branch
 *  UpdatedAt : 2022-07-28
 *  Description : 결제에 대한 데이터를 저장하기 위한 entity
 *  Content :
 *    [ Column && Field ] : id, date, start_time, end_time, amount
 *                          status, guest, point, createdAt, updatedAt
 *                          user, room
 * ======================================================================= */
@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  date: string;

  @Column()
  @Field(() => String)
  start_time: string;

  @Column()
  @Field(() => String)
  end_time: string;

  @Column()
  @Field(() => String)
  impUid: string;

  @Column()
  @Field(() => Int)
  amount: Number;

  @Column()
  @Field(() => String)
  status: string;

  @Column()
  @Field(() => Int)
  guest: number;

  @Column()
  @Field(() => Int)
  point: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Room)
  @Field(() => Room)
  room: Room;
}
