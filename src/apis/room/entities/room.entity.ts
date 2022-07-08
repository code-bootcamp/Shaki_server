import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
import { Review } from 'src/apis/review/entities/review.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Images } from './images.entity';
import { Tags } from './tags.entity';

@Entity()
@ObjectType()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: number;

  @Column()
  @Field(() => String)
  branch: string;

  @Column({ default: 0 })
  @Field(() => Int)
  usedPeople: number;

  @Column({ default: 0 })
  @Field(() => Int)
  starAmount: number;

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

  @Column({ type: 'decimal', precision: 9, scale: 7 })
  @Field(() => Float)
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  @Field(() => Float)
  lng: number;

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
}
