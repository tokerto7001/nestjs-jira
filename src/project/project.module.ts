import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { AuthGuard } from '../guards/auth.guard';
import { ProjectAdminGuard } from '../guards/project-admin.guard';
import { WorkspaceAdminGuard } from '../guards/workspace-admin.guard';
import { ProjectMemberGuard } from '../guards/project-member.guard';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, AuthGuard, WorkspaceAdminGuard, ProjectAdminGuard, ProjectMemberGuard]
})
export class ProjectModule {}
