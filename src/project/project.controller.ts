import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
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
  create(@Param('workspaceId') workspaceId: string, @Body() body: CreateProjectDto) {
    return this.projectService.create(+workspaceId, body);
  }

  @Get()
  @UseGuards(AuthGuard, WorkspaceAdminGuard)
  getProjects(@Param('workspaceId') workspaceId: string) {
    return this.projectService.getProjects(+workspaceId);
  }

  @Get('/my')
  @UseGuards(AuthGuard)
  getMyProjects(@Param('workspaceId') workspaceId: string, @Req() req: Request) {
    return this.projectService.getMyProjects(+workspaceId, req.user.id);
  }

  @Get('/:projectId')
  @UseGuards(AuthGuard, ProjectMemberGuard)
  getProject(@Param('projectId') projectId: string) {
    return this.projectService.getProject(+projectId);
  }

  @Post('/:projectId/members')
  @UseGuards(AuthGuard, ProjectAdminGuard)
  addToProject(@Param('projectId') projectId: string, @Body() { userId }: AddToProjectDto) {
    return this.projectService.addToProject(+projectId, userId);
  }

  @Patch('/:projectId')
  @UseGuards(AuthGuard, ProjectAdminGuard)
  update(@Param('projectId') projectId: string, @Body() body: UpdateProjectDto) {
    return this.projectService.updateProject(+projectId, body);
  }

  @Patch('/:projectId/members')
  @UseGuards(AuthGuard, ProjectAdminGuard)
  updateMemberRole(@Param('projectId') projectId: string, @Body() { userId, role }: UpdateRoleDto) {
    return this.projectService.updateMemberRole(+projectId, userId, role);
  }

  @Get('/:projectId/members')
  @UseGuards(AuthGuard, ProjectMemberGuard)
  getMembers(@Param('projectId') projectId: string,) {
    return this.projectService.getProjectMembers(+projectId);
  }

  @Delete('/:projectId/my')
  @UseGuards(AuthGuard, ProjectMemberGuard)
  exitFromProject(@Param('projectId') projectId: string, @Req() { user }: Request) {
    return this.projectService.exitFromProject(+projectId, user.id);
  }

  @Delete('/:projectId/members')
  @UseGuards(AuthGuard, ProjectAdminGuard)
  removeFromProject(@Param('projectId') projectId: string, @Body() { userId }: RemoveFromProjectDto) {
    return this.projectService.removeFromProject(+projectId, userId);
  }

  @Delete('/:projectId')
  @UseGuards(AuthGuard, WorkspaceAdminGuard)
  delete(@Param('projectId') projectId: string) {
    return this.projectService.deleteProject(+projectId);
  }
}
