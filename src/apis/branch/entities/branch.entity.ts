import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/* =======================================================================
 *  TYPE : Entity
 *  Class : Branch
 *  UpdatedAt : 2022-07-25
 *  Description : 지점에 대한 데이터를 저장하기 위한 entity
 *  Content :
 *    [ Column && Field ] : id, idAll(지점 전체 방 idx 모음),
 *                          branch(지점명), updatedAt, deletedAt
 * ======================================================================= */
@Entity()
@ObjectType()
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column('text', { nullable: true })
  @Field(() => String)
  idAll: string;

  @Column()
  @Field(() => String)
  branch: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
