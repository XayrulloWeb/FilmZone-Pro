import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { AuthGuard } from '@nestjs/passport';

// Создаем простой тип для запроса с пользователем
interface RequestWithUser {
  user: {
    userId: number;
    email: string;
  };
}

@Controller('watchlist')
@UseGuards(AuthGuard('jwt'))
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  getMyList(@Req() req: RequestWithUser) {
    return this.watchlistService.findAll(req.user.userId);
  }

  @Post()
  addMovie(@Req() req: RequestWithUser, @Body() movieData: any) {
    return this.watchlistService.add(req.user.userId, movieData);
  }

  @Delete(':id')
  removeMovie(@Req() req: RequestWithUser, @Param('id') movieId: string) {
    return this.watchlistService.remove(req.user.userId, Number(movieId));
  }
}
