import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppModuleLocal } from './app.moduleLocal';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: ['http://127.0.0.1:5500/test.html'],
    credentials: true,
    exposedHeaders: ['Set-Cookie', 'Authorization'],
  });
  await app.listen(3000);
}
bootstrap();
