import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/loginDto';
import { PayloadInterface } from './interfaces/payload.interface';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { UserService } from 'src/users/user.service';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/createUserDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        console.error('Invalid credentials');
        return null;
      }

      const payload: PayloadInterface = {
        email: user.email,
        sub: user.id.toString(),
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error('Error login in: ' + error.message);
      return null;
    }
  }

  private async validateUser(
    email: string,
    pass: string,
  ): Promise<UserInterface> {
    try {
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        console.error('User not found with email:', email);
        return null; // Retorne null se o usuário não for encontrado
      }

      const isPasswordValid = await this.comparePassword(
        pass,
        user.password_hash,
      );
      if (!isPasswordValid) {
        console.error('Invalid password for user:', email);
        return null; // Retorne null se a senha não for válida
      }

      return user;
    } catch (error) {
      console.error('Error validating user: ' + error.message);
      return null;
    }
  }

  async registerUser(createUserDto: CreateUserDto): Promise<UserInterface> {
    try {
      const passwordHashed = await this.hashPassword(
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

  // Decrypt the Password and return if they are the same
  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
