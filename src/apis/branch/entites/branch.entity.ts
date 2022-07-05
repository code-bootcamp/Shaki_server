import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
import {
  Column,
  ManyToOne,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Images } from './images.entity';
import { Tags } from './tags.entity';

@Entity()
@ObjectType()
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: number;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => String)
  contents: string;

  @Column({default: 0})
  @Field(() => Int)
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

  @Column()
  @Field(() => Float)
  lat: number;

  @Column()
  @Field(() => Float)
  lng: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
