import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TmdbController } from './tmdb.controller';
import { TmdbService } from './tmdb.service';

@Module({
  imports: [HttpModule], // Подключаем модуль HTTP
  controllers: [TmdbController],
  providers: [TmdbService],
})
export class TmdbModule {}
