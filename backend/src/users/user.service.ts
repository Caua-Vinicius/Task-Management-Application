import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/createUserDto';
import { AuthService } from 'src/auth/auth.service';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async checkUserExistance(email: string): Promise<boolean> {
    try {
      const userCount = await this.prisma.user.count({
        where: { email: email },
      });
      return userCount > 0;
    } catch (error) {
      console.error('Error checking user existance: ' + error.message);
      return null;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserInterface> {
    try {
      const passwordHashed = await this.authService.hashPassword(
        createUserDto.password.toString(),
      );
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password_hash: passwordHashed,
        },
      });
      return user;
    } catch (error) {
      console.error('Error creating user: ' + error.message);
      return null;
    }
  }
}
