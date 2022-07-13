import { Field, ObjectType } from '@nestjs/graphql';
import { Room } from 'src/apis/room/entities/room.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String)
  pwd: string;

  @Column({ nullable: true })
  @Field(() => String)
  phone_num: String;

  @Column()
  @Field(() => String)
  email: string;

  @ManyToMany(() => Room, (room) => room.user)
  @Field(() => [Room])
  room: Room[];
}
