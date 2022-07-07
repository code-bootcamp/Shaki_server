import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Room } from './room.entity';

@Entity()
@ObjectType()
export class Images {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: number;

  @Column()
  @Field(() => String)
  url: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Room)
  @Field(() => Room)
  branch: Room;
}
