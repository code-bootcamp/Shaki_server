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
 *  Class : Review
 *  UpdatedAt : 2022-07-30
 *  Description : 리뷰에 대한 데이터를 저장하기 위한 entity
 *  Content :
 *    [ Column && Field ] : id, url, star, updatedAt, deletedAt, room
 * ======================================================================= */

@Entity()
@ObjectType()
export class Images {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Room)
  @Field(() => Room)
  room: Room;
}
