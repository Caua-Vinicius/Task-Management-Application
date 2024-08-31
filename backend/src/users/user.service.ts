import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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

  async findOneById(userId: string): Promise<UserInterface> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      return user;
    } catch (error) {
      console.error('Error fetching user: ' + error.message);
      return null;
    }
  }

  async findOneByEmail(email: string): Promise<UserInterface> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      console.error('Error fetching user: ' + error.message);
      return null;
    }
  }
}
