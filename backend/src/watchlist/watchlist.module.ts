import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import { Watchlist } from './watchlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Watchlist])], // Подключаем таблицу
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class WatchlistModule {}
