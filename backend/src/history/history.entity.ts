import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('history')
export class History {
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

  // Дата последнего просмотра (обновляется сама)
  @UpdateDateColumn()
  viewedAt!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: number;
}
