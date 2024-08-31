import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { LoginDto } from './dto/loginDto';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUserDto';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { UserService } from 'src/users/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const access_token = await this.authService.login(loginDto);
      if (!access_token) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      return {
        message: 'Login successful',
        access_token,
      };
    } catch (error) {
      console.error(`Error logging in the user: ${error.message}`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserInterface> {
    try {
      const userExists = await this.userService.checkUserExistance(
        createUserDto.email,
      );
      if (userExists) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }
      const user: UserInterface =
        await this.authService.registerUser(createUserDto);

      if (!user) {
        throw new HttpException(
          'Failed to create user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return user;
    } catch (error) {
      console.error(`Error creating user: ${error.message}`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
