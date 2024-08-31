import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  exports: [UserService],
  imports: [PrismaModule],
  controllers: [],
  providers: [UserService],
})
export class UserModule {}
