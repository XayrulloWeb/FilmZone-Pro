import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Подключаем таблицу
  providers: [UsersService],
  exports: [UsersService], // Экспортируем, чтобы AuthModule мог использовать
})
export class UsersModule {}
