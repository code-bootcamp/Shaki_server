import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { HttpsModule } from './apis/https/https.module';
import { UserModule } from './apis/user/user.module';
import { PaymentModule } from './apis/payment/payment.module';
import { ReviewModule } from './apis/review/review.module';
import { RoomModule } from './apis/room/room.module';
import { BranchModule } from './apis/branch/branch.module';
import { FileModule } from './apis/file/file.module';
import { AuthModule } from './apis/auth/auth.module';
import { QuestionModule } from './apis/question/question.module';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '10.53.144.4',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'myproject',
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
