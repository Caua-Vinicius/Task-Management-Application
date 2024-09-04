import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
import { JwtStrategy } from './JwtStrategy';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token not found or malformed');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.jwtStrategy.validate(payload);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Attach the user to the request object
      req['user_id'] = user.user.user_id;
      req['email'] = user.user.email;
      next();
    } catch (err) {
      console.error('Invalid token: ' + err.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
