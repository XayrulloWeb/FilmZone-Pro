import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // РЕГИСТРАЦИЯ
  async register(dto: AuthDto) {
    // 1. Проверяем, есть ли такой юзер
    const existUser = await this.usersService.findOneByEmail(dto.email);
    if (existUser)
      throw new BadRequestException(
        'Пользователь с таким Email уже существует',
      );

    // 2. Хешируем пароль
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(dto.password, salt);

    // 3. Создаем юзера
    const user = await this.usersService.create({
      email: dto.email,
      password: hashPassword,
    });

    // 4. Возвращаем токен
    return this.generateToken(user.id, user.email);
  }

  // ВХОД
  async login(dto: AuthDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Неверный Email или пароль');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Неверный Email или пароль');

    return this.generateToken(user.id, user.email);
  }

  private generateToken(userId: number, email: string) {
    return {
      access_token: this.jwtService.sign({ sub: userId, email }),
      user: { id: userId, email },
    };
  }
}
