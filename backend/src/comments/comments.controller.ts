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
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithUser {
  user: { userId: number; email: string };
}

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // Получить комментарии (Доступно всем)
  @Get(':movieId')
  getComments(@Param('movieId') movieId: string) {
    return this.commentsService.findAll(Number(movieId));
  }

  // Добавить (Только авторизованным)
  @Post()
  @UseGuards(AuthGuard('jwt'))
  addComment(
    @Req() req: RequestWithUser,
    @Body() body: { movieId: number; content: string },
  ) {
    return this.commentsService.create(
      req.user.userId,
      body.movieId,
      body.content,
    );
  }

  // Удалить (Только авторизованным)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteComment(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.commentsService.remove(req.user.userId, Number(id));
  }
}
