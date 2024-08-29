import { Body, Controller, Post } from '@nestjs/common';
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
}
