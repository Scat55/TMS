import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['access_token'];

    if (!token) throw new UnauthorizedException('Токен отсутствует');

    try {
      const payload = this.jwt.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Токен недействителен или истёк');
    }
  }
}
