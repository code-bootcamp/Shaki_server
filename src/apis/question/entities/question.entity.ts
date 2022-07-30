import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

/* =======================================================================
 *  TYPE : Entity
 *  Class : Question
 *  UpdatedAt : 2022-07-28
 *  Description : 질문에 대한 데이터를 저장하기 위한 entity
 *  Content :
 *    [ Column && Field ] : id, name, email, title, category
 *                          content, user
 * ======================================================================= */
@Entity()
@ObjectType()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  category: string;

  @Column()
  @Field(() => String)
  content: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
