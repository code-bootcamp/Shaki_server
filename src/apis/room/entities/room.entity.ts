import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinTable,
  ManyToMany,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tags } from './tags.entity';
import { Images } from './images.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Branch } from '../../branch/entities/branch.entity';
import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
import { Review } from 'src/apis/review/entities/review.entity';

/* =======================================================================
 *  TYPE : Entity
 *  Class : Room
 *  UpdatedAt : 2022-07-30
 *  Description : 방에 대한 데이터를 저장하기 위한 entity
 *  Content :
 *    [ Column && Field ] : id, usedPeople(사용자 수), starAmount, remarks,
 *                          name, price, maxPeople(사용 가능 인원), contents
 *                          star, zipcode, address, conaddressDetail
 *                          updatedAt, deletedAt, images, tags, reviews
 *                          branch, user
 * ======================================================================= */

@Entity()
@ObjectType()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ default: 0 })
  @Field(() => Int)
  usedPeople: number;

  @Column({ default: 0 })
  @Field(() => Int)
  starAmount: number;

  @Column()
  @Field(() => String)
  remarks: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => Int)
  maxPeople: number;

  @Column()
  @Field(() => String)
  contents: string;

  @Column({ default: 0, type: 'decimal', precision: 2, scale: 1 })
  @Field(() => Float)
  star: number;

  @Column()
  @Field(() => String)
  zipcode: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => String)
  conaddressDetail: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Images, (images) => images.room)
  @Field(() => [Images])
  images: Images[];

  @OneToMany(() => Tags, (tags) => tags.room)
  @Field(() => [Tags])
  tags: Tags[];

  @OneToMany(() => Review, (reviews) => reviews.room)
  @Field(() => [Review])
  reviews: Review[];

  @ManyToOne(() => Branch)
  @Field(() => Branch)
  branch: Branch;

  @JoinTable()
  @ManyToMany(() => User, (user) => user.room)
  @Field(() => [User])
  user: User[];
}
