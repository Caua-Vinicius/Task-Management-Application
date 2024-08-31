import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../users/user.service';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { PayloadInterface } from './interfaces/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: PayloadInterface) {
    const user: UserInterface = await this.usersService.findOneById(
      payload.sub,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
