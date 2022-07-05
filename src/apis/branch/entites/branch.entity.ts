import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
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

  @Column({ default: 0 })
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

  @OneToMany(() => Images, (images) => images.branch)
  @Field(() => [Images])
  images: Images[];

  @OneToMany(() => Tags, (tags) => tags.branch)
  @Field(() => [Tags])
  tags: Tags[];
}
