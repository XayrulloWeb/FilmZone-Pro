import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './history/history.entity';
import { TmdbModule } from './tmdb/tmdb.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Comment } from './comments/comment.entity';
import { WatchlistModule } from './watchlist/watchlist.module';
import { User } from './users/user.entity';
import { Watchlist } from './watchlist/watchlist.entity';
import { HistoryModule } from './history/history.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // Исправление: entities должны быть внутри возвращаемого объекта
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        entities: [User, Watchlist, History, Comment], // Добавляем History и Comment сюда
        database: config.get<string>('DB_NAME'),
        synchronize: true,
      }),
    }),
    TmdbModule,
    UsersModule,
    AuthModule,
    WatchlistModule,
    HistoryModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
