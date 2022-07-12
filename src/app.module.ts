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
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '10.112.128.5',
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
      url: 'redis://10.112.129.3:6379',
      isGlobal: true,
    }),
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
