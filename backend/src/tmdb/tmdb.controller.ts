import { Controller, Get, Param, Query } from '@nestjs/common';
import { TmdbService } from './tmdb.service';

@Controller('tmdb') // Все пути начнутся с /api/tmdb
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  // 1. Тренды (Например: /api/tmdb/trending/movie/week)
  @Get('trending/:type/:time')
  getTrending(@Param('type') type: string, @Param('time') time: string) {
    return this.tmdbService.get(`/trending/${type}/${time}`);
  }

  // 2. Списки (Например: /api/tmdb/movie/popular)
  @Get(':type/:category')
  getList(
    @Param('type') type: string,
    @Param('category') category: string,
    @Query() query: any,
  ) {
    // query - это ?page=1&language=ru и т.д.
    return this.tmdbService.get(`/${type}/${category}`, query);
  }

  // 3. Поиск (Например: /api/tmdb/search/movie?query=batman)
  @Get('search/:type')
  search(@Param('type') type: string, @Query() query: any) {
    return this.tmdbService.get(`/search/${type}`, query);
  }

  // 4. Детали (Например: /api/tmdb/detail/movie/123)
  @Get('detail/:type/:id')
  getDetail(
    @Param('type') type: string,
    @Param('id') id: string,
    @Query() query: any,
  ) {
    return this.tmdbService.get(`/${type}/${id}`, query);
  }

  // ... старые методы (trending, search, getList, getDetail) оставь ...

  // 5. Каталог с фильтрами (Discover)
  @Get('discover/:type')
  discover(@Param('type') type: string, @Query() query: any) {
    return this.tmdbService.get(`/discover/${type}`, query);
  }

  // 6. Список жанров
  @Get('genre/:type/list')
  getGenres(@Param('type') type: string, @Query() query: any) {
    return this.tmdbService.get(`/genre/${type}/list`, query);
  }

  // 7. Сезоны сериалов
  @Get('tv/:id/season/:seasonNumber')
  getSeason(
    @Param('id') id: string,
    @Param('seasonNumber') seasonNumber: string,
    @Query() query: any,
  ) {
    return this.tmdbService.get(`/tv/${id}/season/${seasonNumber}`, query);
  }

  // 8. Персона (Актеры)
  @Get('person/:id')
  getPerson(@Param('id') id: string, @Query() query: any) {
    return this.tmdbService.get(`/person/${id}`, query);
  }
}
