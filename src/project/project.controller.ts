import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import { AuthGuard } from '../guards/auth.guard';
import { AddToProjectDto } from './dtos/add-to-project.dto';
import { ProjectAdminGuard } from '../guards/project-admin.guard';
import { WorkspaceAdminGuard } from '../guards/workspace-admin.guard';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { ProjectMemberGuard } from '../guards/project-member.guard';
import type { Request } from 'express';
import { RemoveFromProjectDto } from './dtos/remove-from-project.dto';

@Controller('workspace/:workspaceId/project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  @UseGuards(AuthGuard, WorkspaceAdminGuard)
  create(@Param('workspaceId', ParseIntPipe) workspaceId: number, @Body() body: CreateProjectDto) {
    return this.projectService.create(workspaceId, body);
  }

  @Get()
  @UseGuards(AuthGuard, WorkspaceAdminGuard)
  getProjects(@Param('workspaceId', ParseIntPipe) workspaceId: number) {
    return this.projectService.getProjects(workspaceId);
  }

  @Get('/my')
  @UseGuards(AuthGuard)
  getMyProjects(@Param('workspaceId', ParseIntPipe) workspaceId: number, @Req() req: Request) {
    return this.projectService.getMyProjects(workspaceId, req.user.id);
  }

  @Get('/:projectId')
  @UseGuards(AuthGuard, ProjectMemberGuard)
  getProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectService.getProject(projectId);
  }

  @Post('/:projectId/members')
  @UseGuards(AuthGuard, ProjectAdminGuard)
  addToProject(@Param('projectId', ParseIntPipe) projectId: number, @Body() { userId }: AddToProjectDto) {
    return this.projectService.addToProject(projectId, userId);
  }

  @Patch('/:projectId')
  @UseGuards(AuthGuard, ProjectAdminGuard)
  update(@Param('projectId', ParseIntPipe) projectId: number, @Body() body: UpdateProjectDto) {
    return this.projectService.updateProject(projectId, body);
  }

  @Patch('/:projectId/members')
  @UseGuards(AuthGuard, ProjectAdminGuard)
  updateMemberRole(@Param('projectId', ParseIntPipe) projectId: number, @Body() { userId, role }: UpdateRoleDto) {
    return this.projectService.updateMemberRole(projectId, userId, role);
  }

  @Get('/:projectId/members')
  @UseGuards(AuthGuard, ProjectMemberGuard)
  getMembers(@Param('projectId', ParseIntPipe) projectId: number,) {
    return this.projectService.getProjectMembers(projectId);
  }

  @Delete('/:projectId/my')
  @UseGuards(AuthGuard, ProjectMemberGuard)
  exitFromProject(@Param('projectId', ParseIntPipe) projectId: number, @Req() { user }: Request) {
    return this.projectService.exitFromProject(projectId, user.id);
  }

  @Delete('/:projectId/members')
  @UseGuards(AuthGuard, ProjectAdminGuard)
  removeFromProject(@Param('projectId', ParseIntPipe) projectId: number, @Body() { userId }: RemoveFromProjectDto) {
    return this.projectService.removeFromProject(projectId, userId);
  }

  @Delete('/:projectId')
  @UseGuards(AuthGuard, WorkspaceAdminGuard)
  delete(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectService.deleteProject(projectId);
  }
}
