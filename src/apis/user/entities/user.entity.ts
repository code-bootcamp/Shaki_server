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

  @Column({ nullable: true })
  @Field(() => String)
  pwd: string;

  @Column({ nullable: true })
  @Field(() => String)
  phone_num: String;

  @Column()
  @Field(() => String)
  email: string;

  // 영래야 배고팡... 나 밥사줘 응애
  // 밥먹고싶어 응애 밥사줘 응애응애응앵
}
