import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('watchlist')
export class Watchlist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  movieId!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  poster_path!: string;

  @Column({ type: 'float', default: 0 })
  vote_average!: number;

  @Column()
  media_type!: string;

  // 🔥 ИСПРАВЛЕНИЕ ЗДЕСЬ:
  // Мы убрали второй аргумент "(user) => user.id", так как он вызывал ошибку 500
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: number;
}
