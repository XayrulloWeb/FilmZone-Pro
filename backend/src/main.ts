import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем CORS, чтобы фронтенд (http://localhost:5173) мог делать запросы
  app.enableCors();

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 5000);
}
void bootstrap(); // <-- Добавили void
