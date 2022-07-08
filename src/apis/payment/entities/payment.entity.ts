import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  type: string;

  @Column()
  @Field(() => String)
  buyer: string;

  @Column()
  @Field(() => String)
  branch_name: string;

  @Column()
  @Field(() => String)
  use_time: string;

  @Column()
  @Field(() => Int)
  amount: Number;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
