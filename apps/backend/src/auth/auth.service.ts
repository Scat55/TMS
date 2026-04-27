import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // REGISTER
  async register(dto: RegisterDto, res: Response) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) throw new ConflictException('Пользователь уже существует');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    await this.setTokens(user?.id, user?.email, res);

    return { message: 'Пользователь успешно зарегистрирован' };
  }

  // LOGIN
  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user)
      throw new UnauthorizedException('Такого пользователя не существует');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Неверный email или пароль');

    await this.setTokens(user.id, user.email, res);

    return { message: 'Вход выполнен' };
  }

  // REFRESH
  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken)
      throw new UnauthorizedException('Refresh токен отсутствует');

    const user = await this.prisma.user.findFirst({
      where: { refreshToken },
    });

    if (!user) throw new UnauthorizedException('Невалидный refresh токен');

    try {
      this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Refresh токен истёк');
    }

    await this.setTokens(user.id, user.email, res);

    return { message: 'Токен обновлён' };
  }

  // LOGOUT
  async logout(res: Response) {
    res.clearCookie('access_token', { sameSite: 'none', secure: true });
    res.clearCookie('refresh_token', { sameSite: 'none', secure: true });
    return { message: 'Выход выполнен' };
  }

  private async setTokens(userId: number, email: string, res: Response) {
    const payload = { sub: userId, email };

    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // Сохраняем refresh токен в базе
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });

    // Устанавливаем cookies
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true, // обязательно true для sameSite: none
      sameSite: 'none', // разрешает кросс-доменные cookies
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
