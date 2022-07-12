import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { HttpsModule } from './apis/https/https.module';
import { UserModule } from './apis/user/user.module';
import { RoomModule } from './apis/room/room.module';
import { AuthModule } from './apis/auth/auth.module';
import { ReviewModule } from './apis/review/review.module';
import { PaymentModule } from './apis/payment/payment.module';
import { BranchModule } from './apis/branch/branch.module';
import { FileModule } from './apis/file/file.module';

@Module({
  imports: [
    HttpsModule,
    AuthModule,
    UserModule,
    RoomModule,
    ReviewModule,
    PaymentModule,
    BranchModule,
    FileModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: ['http://127.0.0.1:5500/test.html'],
        credentials: 'include',
        exposedHeaders: ['Set-Cookie', 'Authorization'],
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'shaki_database',
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
      url: 'redis://shaki-redis:6379',
      isGlobal: true,
    }),
  ],
})
export class AppModuleLocal {}
