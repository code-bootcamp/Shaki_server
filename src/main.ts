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
    origin: 'http://localhost:3000/',
    credentials: true,
  });
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
