import {
  Column,
  Entity,
  ManyToOne,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { Field, ObjectType } from '@nestjs/graphql';

/* =======================================================================
 *  TYPE : Entity
 *  Class : Tags
 *  UpdatedAt : 2022-07-30
 *  Description : 룸데이터 태그에 대한 데이터를 저장하기 위한 entity
 *  Content :
 *    [ Column && Field ] : id, tag, updatedAt, deletedAt, room
 * ======================================================================= */
@Entity()
@ObjectType()
export class Tags {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  tag: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Room)
  @Field(() => Room)
  room: Room;
}
