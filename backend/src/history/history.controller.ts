import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithUser {
  user: { userId: number; email: string };
}

@Controller('history')
@UseGuards(AuthGuard('jwt'))
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  getMyHistory(@Req() req: RequestWithUser) {
    return this.historyService.findAll(req.user.userId);
  }

  @Post()
  addToHistory(@Req() req: RequestWithUser, @Body() movieData: any) {
    return this.historyService.add(req.user.userId, movieData);
  }

  @Delete()
  clearHistory(@Req() req: RequestWithUser) {
    return this.historyService.clear(req.user.userId);
  }
}
