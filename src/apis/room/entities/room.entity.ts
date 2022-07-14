import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
import { Review } from 'src/apis/review/entities/review.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Branch } from '../../branch/entities/branch.entity';
import { Images } from './images.entity';
import { Tags } from './tags.entity';

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
