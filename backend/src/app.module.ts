import { Module } from '@nestjs/common';
import { TaskModule } from './tasks/task.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [UserModule, TaskModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
