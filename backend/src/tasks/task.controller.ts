import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  Delete,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/createTaskDto';
import { TaskInterface } from './interfaces/task.interface';
import { UpdateTaskStatusDto } from './dto/updateTaskStatusDto';
import { UpdateTaskDto } from './dto/updateTaskDto';
import { UserInfoRequest } from './interfaces/reqUserInfo';
import { CreateTaskWithoutUserDto } from './dto/createTaskWithoutUserDto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  async create(
    @Body() createTaskWithoutUserDto: CreateTaskWithoutUserDto,
    @Req() req: UserInfoRequest,
  ): Promise<TaskInterface> {
    try {
      const userId: string = req['user_id'];
      if (!userId) {
        throw new HttpException('User ID not provided', HttpStatus.BAD_REQUEST);
      }
      const createTaskDto: CreateTaskDto = {
        ...createTaskWithoutUserDto,
        userId,
      };
      const task = await this.taskService.createTask(createTaskDto);
      if (!task) {
        throw new HttpException(
          'Failed to Create task',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return task;
    } catch (error) {
      console.error(`Error creating task: ${error.message}`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('')
  async getAllUserTasks(@Req() req: UserInfoRequest): Promise<TaskInterface[]> {
    try {
      const user_id: string = req['user_id'];
      if (!user_id) {
        throw new HttpException('User ID not provided', HttpStatus.BAD_REQUEST);
      }
      const tasks = await this.taskService.listAllTasksbyUserId(user_id);
      if (!tasks) {
        throw new HttpException(
          'Failed to fetch tasks',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return tasks;
    } catch (error) {
      console.error(
        `Error fetching tasks for user ID ${req['user_id']}: ${error.message}`,
      );
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Req() req: UserInfoRequest,
  ): Promise<{ success: boolean }> {
    try {
      const userId = req['user_id'];
      const taskExists = await this.taskService.validateTaskOwnership(
        id,
        userId,
      );
      if (!taskExists) {
        throw new HttpException(
          'Task not found or not authorized',
          HttpStatus.NOT_FOUND,
        );
      }
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
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: UserInfoRequest,
  ): Promise<{ success: boolean }> {
    try {
      const userId = req['user_id'];
      const taskExists = await this.taskService.validateTaskOwnership(
        id,
        userId,
      );
      if (!taskExists) {
        throw new HttpException(
          'Task not found or not authorized',
          HttpStatus.NOT_FOUND,
        );
      }
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

  @Delete(':id/delete')
  async deleteTask(
    @Param('id') id: string,
    @Req() req: UserInfoRequest,
  ): Promise<TaskInterface> {
    try {
      const userId = req['user_id'];
      if (!userId) {
        throw new HttpException('User ID not provided', HttpStatus.BAD_REQUEST);
      }

      const taskExists = await this.taskService.validateTaskOwnership(
        id,
        userId,
      );
      if (!taskExists) {
        throw new HttpException(
          'Task not found or not authorized',
          HttpStatus.NOT_FOUND,
        );
      }

      const deletedTask = await this.taskService.deleteTask(id);
      if (!deletedTask) {
        throw new HttpException(
          'Failed to delete task',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return deletedTask;
    } catch (error) {
      console.error(`Error deleting task for ID ${id}: ${error.message}`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
