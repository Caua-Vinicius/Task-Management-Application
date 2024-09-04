import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TaskModule } from './tasks/task.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  imports: [
    UserModule,
    TaskModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'tasks', method: RequestMethod.ALL },
        { path: 'tasks/*', method: RequestMethod.ALL },
      );
  }
}
