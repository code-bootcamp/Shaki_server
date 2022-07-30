import { RedisClientOptions } from 'redis';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './apis/user/user.module';
import { RoomModule } from './apis/room/room.module';
import { FileModule } from './apis/file/file.module';
import { AuthModule } from './apis/auth/auth.module';
import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { HttpsModule } from './apis/https/https.module';
import { ReviewModule } from './apis/review/review.module';
import { BranchModule } from './apis/branch/branch.module';
import { PaymentModule } from './apis/payment/payment.module';
import { QuestionModule } from './apis/question/question.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: ['http://localhost:3000', 'https://sha-ki.shop'],
        credentials: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '10.35.240.3',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://10.35.241.3:6379',
      isGlobal: true,
    }),
    QuestionModule,
    HttpsModule,
    AuthModule,
    UserModule,
    RoomModule,
    PaymentModule,
    ReviewModule,
    BranchModule,
    FileModule,
  ],
})
export class AppModule {}
