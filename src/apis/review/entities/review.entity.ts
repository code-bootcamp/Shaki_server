import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Room } from 'src/apis/room/entities/room.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
@ObjectType()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: number;

  @Column()
  @Field(() => String)
  writer: string;

  @Column()
  @Field(() => String)
  content: string;

  @Column()
  @Field(() => Int)
  star: number;

  @CreateDateColumn()
  createAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Room)
  @Field(() => Room)
  room: Room;
}
