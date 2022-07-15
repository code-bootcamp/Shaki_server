import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Branch } from 'src/apis/branch/entities/branch.entity';
import { Room } from 'src/apis/room/entities/room.entity';
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
  date: string;

  @Column()
  @Field(() => String)
  start_time: string;

  @Column()
  @Field(() => String)
  end_time: string;

  @Column()
  @Field(() => Int)
  amount: Number;

  @Column()
  @Field(() => String)
  status: string;

  @Column()
  @Field(() => Int)
  guest: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Branch)
  @Field(() => Branch)
  branch: Branch;

  @ManyToOne(() => Room)
  @Field(() => Room)
  room: Room;
}
