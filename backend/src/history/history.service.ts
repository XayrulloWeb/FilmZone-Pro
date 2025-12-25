/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepo: Repository<History>,
  ) {}

  // Добавить в историю (или обновить дату, если уже есть)
  async add(userId: number, movieData: any) {
    const movieId = movieData.id;

    // 1. Ищем, смотрели ли этот фильм раньше
    let item = await this.historyRepo.findOne({
      where: { userId, movieId },
    });

    if (item) {
      // 2. Если да — просто обновляем дату просмотра
      item.viewedAt = new Date();
    } else {
      // 3. Если нет — создаем запись
      item = this.historyRepo.create({
        userId,
        movieId,
        title: movieData.title || movieData.name,
        poster_path: movieData.poster_path,
        vote_average: movieData.vote_average,
        media_type: movieData.media_type || 'movie',
      });
    }

    // Сохраняем (save работает как upsert)
    return this.historyRepo.save(item);
  }

  // Очистить всю историю
  async clear(userId: number) {
    await this.historyRepo.delete({ userId });
    return { success: true };
  }

  // Получить список (сначала новые)
  async findAll(userId: number) {
    return this.historyRepo.find({
      where: { userId },
      order: { viewedAt: 'DESC' }, // Сортируем по дате просмотра
      take: 20, // Ограничим историю 20 фильмами (как на фронте)
    });
  }
}
