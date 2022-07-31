import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Room } from 'src/apis/room/entities/room.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

/* =======================================================================
 *  TYPE : Entity
 *  Class : Review
 *  UpdatedAt : 2022-07-30
 *  Description : 리뷰에 대한 데이터를 저장하기 위한 entity
 *  Content :
 *    [ Column && Field ] : id, content, star, createAt, deletedAt
 *                          room, user
 * ======================================================================= */

@Entity()
@ObjectType()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  content: string;

  @Column()
  @Field(() => Int)
  star: number;

  @CreateDateColumn()
  createAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Room)
  @Field(() => Room)
  room: Room;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
