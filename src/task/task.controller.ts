import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProjectMemberGuard } from 'src/guards/project-member.guard';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksDto } from './dtos/get-tasks.dto';

@Controller('/workspace/:workspaceId/project/:projectId/task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @UseGuards(AuthGuard, ProjectMemberGuard)
  create(@Param('projectId') projectId: string, @Body() body: CreateTaskDto) {
    return this.taskService.create(+projectId, body);
  }

  @Get()
  @UseGuards(AuthGuard, ProjectMemberGuard)
  getTasks(@Param('projectId') projectId: string, @Query() {limit, offset}: GetTasksDto) {
    return this.taskService.getTasks(+projectId, limit, offset);
  }

  @Get('/:taskId')
  @UseGuards(AuthGuard, ProjectMemberGuard)
  getTask(@Param('projectId') projectId: string, @Param('taskId') taskId: string) {
    return this.taskService.getTask(+projectId, +taskId);
  }
}
