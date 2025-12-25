import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
  ) {}

  // Добавить комментарий
  async create(userId: number, movieId: number, content: string) {
    const comment = this.commentRepo.create({
      userId,
      movieId,
      content,
    });
    return this.commentRepo.save(comment);
  }

  // Получить комментарии фильма (вместе с email автора)
  async findAll(movieId: number) {
    return this.commentRepo.find({
      where: { movieId },
      relations: ['user'], // Подгружаем данные юзера
      order: { createdAt: 'DESC' }, // Свежие сверху
    });
  }

  // Удалить (только свой)
  async remove(userId: number, commentId: number) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException('Комментарий не найден');
    if (comment.userId !== userId)
      throw new ForbiddenException('Нельзя удалять чужие комментарии');

    await this.commentRepo.delete(commentId);
    return { success: true };
  }
}
