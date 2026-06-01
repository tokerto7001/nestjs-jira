import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import type { Request } from 'express';
import { UpdateWorkspaceDto } from './dtos/update-workspace.dto';
import { WorkspaceAdminGuard } from '../guards/workspace-admin.guard';
import { GetWorkspaceDto } from './dtos/get-workspace.dto';
import { WorkspaceMemberGuard } from './guards/workspace-member.guard';
import { MemberOperationDto } from './dtos/member-operation.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Controller('workspace')
export class WorkspaceController {
  constructor(
    private workspaceService: WorkspaceService
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() request: Request, @Body() { name }: CreateWorkspaceDto) {
    return this.workspaceService.create(request.user!.id, name);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard, WorkspaceAdminGuard)
  update(@Param('id') id: string, @Body() { name }: UpdateWorkspaceDto) {
    return this.workspaceService.update(+id, name);
  }

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  getWorkspaces(@Query() { limit, offset }: GetWorkspaceDto) {
    return this.workspaceService.getAll(limit, offset);
  }

  @Get('/my')
  @UseGuards(AuthGuard)
  getMyWorkspaces(@Req() request: Request) {
    return this.workspaceService.getMyWorkspaces(request.user.id);
  }

  @Get('/:id')
  @UseGuards(AuthGuard, WorkspaceMemberGuard)
  getWorkspace(@Param('id') id: string) {
    return this.workspaceService.get(+id);
  }

  @Get('/:id/members')
  @UseGuards(AuthGuard, WorkspaceAdminGuard)
  getMembers(@Param('id') id: string) {
    return this.workspaceService.getMembers(+id);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard, WorkspaceAdminGuard)
  delete(@Param('id') id: string) {
    return this.workspaceService.delete(+id);
  }

  @Post('/:id/members')
  @UseGuards(AuthGuard, WorkspaceAdminGuard)
  addUserToWorkspace(@Param('id') id: string, @Body() { userId }: MemberOperationDto) {
    return this.workspaceService.addToWorkspace(+id, userId);
  }

  @Delete('/:id/members')
  @UseGuards(AuthGuard, WorkspaceAdminGuard)
  removeUserFromWorkspace(@Param('id') id: string, @Body() { userId }: MemberOperationDto) {
    return this.workspaceService.removeFromWorkspace(+id, userId);
  }

  @Delete('/:id/my')
  @UseGuards(AuthGuard, WorkspaceMemberGuard)
  exitFromWorkspace(@Param('id') id: string, @Req() { user }: Request) {
    return this.workspaceService.exitFromWorkspace(+id, user.id);
  }

  @Patch('/:id/members/role')
  @UseGuards(AuthGuard, WorkspaceAdminGuard)
  updateMemberRole(@Param('id') id: string, @Body() { userId, role }: UpdateRoleDto) {
    return this.workspaceService.updateMemberRole(+id, userId, role);
  }

}
