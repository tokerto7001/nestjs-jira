import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProjectMemberGuard } from 'src/guards/project-member.guard';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksDto } from './dtos/get-tasks.dto';
import type { Request } from 'express';
import { ProjectAdminGuard } from 'src/guards/project-admin.guard';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Controller('/workspace/:workspaceId/project/:projectId/task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @UseGuards(AuthGuard, ProjectMemberGuard)
  create(@Param('projectId', ParseIntPipe) projectId: number, @Body() body: CreateTaskDto) {
    return this.taskService.create(projectId, body);
  }

  @Get()
  @UseGuards(AuthGuard, ProjectMemberGuard)
  getTasks(@Param('projectId', ParseIntPipe) projectId: number, @Query() {limit, offset}: GetTasksDto) {
    return this.taskService.getTasks(projectId, limit, offset);
  }

  @Get('/my')
  @UseGuards(AuthGuard, ProjectMemberGuard)
  getMyTasks(@Param('projectId', ParseIntPipe) projectId: number, @Req() request: Request, @Query() {limit, offset}: GetTasksDto ) {
    return this.taskService.getMyTasks(projectId, request.user.id, limit, offset);
  }

  @Get('/:taskId')
  @UseGuards(AuthGuard, ProjectMemberGuard)
  getTask(@Param('projectId', ParseIntPipe) projectId: number, @Param('taskId', ParseIntPipe) taskId: number) {
    return this.taskService.getTask(projectId, taskId);
  }

  @Delete('/:taskId')
  @UseGuards(AuthGuard, ProjectAdminGuard)
  delete(@Param('projectId', ParseIntPipe) projectId: number, @Param('taskId', ParseIntPipe) taskId: number) {
    return this.taskService.delete(projectId, taskId);
  }

  @Patch('/:taskId')
  @UseGuards(AuthGuard, ProjectMemberGuard)
  update(@Param('projectId', ParseIntPipe) projectId: number, @Param('taskId', ParseIntPipe) taskId: number, @Body() body: UpdateTaskDto) {
    return this.taskService.update(projectId, taskId, body);
  }
}
