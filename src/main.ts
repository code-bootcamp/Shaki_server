import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { AppModuleLocal } from './app.moduleLocal';
import { graphqlUploadExpress } from 'graphql-upload';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModuleLocal);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(graphqlUploadExpress());
  app.enableCors({
    origin: ['http://localhost:3000', 'https://sha-ki.shop'],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
