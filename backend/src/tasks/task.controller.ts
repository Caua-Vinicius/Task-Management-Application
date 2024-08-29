import {
  Body,
  Controller,
  Post,
  Headers,
  Get,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/createTaskDto';
import { TaskInterface } from './interfaces/task.interface';
import { UpdateTaskStatusDto } from './dto/updateTaskStatusDto';
import { UpdateTaskDto } from './dto/updateTaskDto';

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

  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<{ success: boolean }> {
    try {
      const success = await this.taskService.updateTaskStatus(
        id,
        updateTaskStatusDto,
      );
      if (!success) {
        throw new HttpException(
          'Failed to update task status',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return { success };
    } catch (error) {
      console.error(
        `Error updating task status for ID ${id}': ${error.message}`,
      );
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/update')
  async updateTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<{ success: boolean }> {
    try {
      const success = await this.taskService.updateTask(id, updateTaskDto);
      if (!success) {
        throw new HttpException(
          'Failed to update task',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return { success: true };
    } catch (error) {
      console.error(`Error updating task for ID ${id}: ${error.message}`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
