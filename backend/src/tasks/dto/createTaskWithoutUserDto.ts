import { IsString } from 'class-validator';

export class CreateTaskWithoutUserDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
