import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Module({
  controllers: [TaskController],
  providers: [TaskService, AuthGuard,]
})
export class TaskModule {}
