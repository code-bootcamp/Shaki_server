import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestModule } from './apis/test/test.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { HttpsModule } from './apis/https/https.module';
import { UserModule } from './apis/user/user.module';
import { RoomModule } from './apis/room/room.module';
import { AuthModule } from './apis/auth/auth.module';

@Module({
  imports: [
    TestModule,
    HttpsModule,
    AuthModule,
    UserModule,
    RoomModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
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
