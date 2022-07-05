import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  nickname: String;

  @Column()
  @Field(() => String)
  pwd: string;

  @Column()
  @Field(() => String)
  phone_num: String;

  @Column()
  @Field(() => String)
  email: string;
}
