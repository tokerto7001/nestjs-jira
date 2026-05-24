import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import type { Request } from 'express';
import { UpdateWorkspaceDto } from './dtos/update-workspace.dto';
import { WorkspaceAdminGuard } from './guards/workspace-admin.guard';
import { GetWorkspaceDto } from './dtos/get-workspace.dto';
import { WorkspaceMemberGuard } from './guards/workspace-member.guard';

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

  @Delete('/:id')
  @UseGuards(AuthGuard, WorkspaceAdminGuard)
  delete(@Param('id') id: string) {
    return this.workspaceService.delete(+id);
  }

}
