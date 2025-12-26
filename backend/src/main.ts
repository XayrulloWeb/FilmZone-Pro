import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ СТАЛО: Жесткая настройка CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',                  // Для разработки
      process.env.FRONTEND_URL || '*',          // Ссылка на твой боевой сайт (например, https://filmzone.vercel.app)
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Разрешаем куки/заголовки
  });

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 5000);
}
void bootstrap();