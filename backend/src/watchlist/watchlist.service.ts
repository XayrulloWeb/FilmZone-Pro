/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Watchlist } from './watchlist.entity';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Watchlist)
    private watchlistRepo: Repository<Watchlist>,
  ) {}

  async add(userId: number, movieData: any) {
    const movieId = movieData.id;

    const exists = await this.watchlistRepo.findOne({
      where: { userId, movieId },
    });
    if (exists) throw new ConflictException('Фильм уже в списке');

    const item = this.watchlistRepo.create({
      userId,
      movieId,
      title: movieData.title || movieData.name,
      poster_path: movieData.poster_path,
      vote_average: movieData.vote_average,
      media_type: movieData.media_type || 'movie',
    });

    return this.watchlistRepo.save(item);
  }

  async remove(userId: number, movieId: number) {
    await this.watchlistRepo.delete({ userId, movieId });
    return { success: true };
  }

  async findAll(userId: number) {
    return this.watchlistRepo.find({
      where: { userId },
      order: { id: 'DESC' },
    });
  }
}
