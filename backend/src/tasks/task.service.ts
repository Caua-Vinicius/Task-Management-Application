import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/createTaskDto';
import { PrismaService } from 'prisma/prisma.service';
import { TaskInterface } from './interfaces/task.interface';
import { UpdateTaskStatusDto } from './dto/updateTaskStatusDto';
import { UpdateTaskDto } from './dto/updateTaskDto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskInterface> {
    try {
      const task = await this.prisma.task.create({ data: createTaskDto });
      return task;
    } catch (error) {
      console.error('Error creating task: ' + error);
      return null;
    }
  }

  async listAllTasksbyUserId(user_id: string): Promise<TaskInterface[]> {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          userId: user_id,
        },
      });
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks: ' + error);
      return null;
    }
  }

  async updateTaskStatus(
    taskId: string,
    status: UpdateTaskStatusDto,
  ): Promise<boolean> {
    try {
      await this.prisma.task.update({
        where: { id: taskId },
        data: { completed: status.completed },
      });

      return true;
    } catch (error) {
      console.error('Error updating task status: ', error);
      return false;
    }
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskInterface> {
    try {
      const updatedTask = await this.prisma.task.update({
        where: { id: id },
        data: {
          title: updateTaskDto.title,
          description: updateTaskDto.description,
        },
      });
      return updatedTask;
    } catch (error) {
      console.error('Error updating task status: ', error);
      return null;
    }
  }
}
