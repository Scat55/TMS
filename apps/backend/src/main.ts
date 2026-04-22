import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // убирает лишние поля
      forbidNonWhitelisted: true, // ошибка если пришли лишние поля
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL, // url фронта
    credentials: true, // разрешаем cookies
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
