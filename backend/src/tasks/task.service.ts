import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/createTaskDto';
import { PrismaService } from 'prisma/prisma.service';
import { TaskInterface } from './interfaces/task.interface';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskInterface> {
    try {
      const task = this.prisma.task.create({ data: createTaskDto });
      return task;
    } catch (error) {
      console.error('Error creating task: ' + error);
      return null;
    }
  }
}
