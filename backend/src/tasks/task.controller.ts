import { Body, Controller, Post, Headers, Get } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/createTaskDto';
import { TaskInterface } from './interfaces/task.interface';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  async create(@Body() createTaskDto: CreateTaskDto): Promise<TaskInterface> {
    try {
      const task = await this.taskService.createTask(createTaskDto);
      return task;
    } catch (error) {
      console.error('Error tasks/create>' + error);
    }
  }

  @Get('')
  async getAllUserTasks(@Headers('user_id') user_id: string) {
    try {
      if (!user_id) {
        return { message: 'User not provided' };
      }
      const tasks = await this.taskService.listAllTasksbyUserId(user_id);
      return tasks;
    } catch (error) {
      console.error('Error tasks/>' + error);
      return [];
    }
  }
}
