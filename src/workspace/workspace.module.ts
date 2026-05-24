import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspaceAdminGuard } from './guards/workspace-admin.guard';
import { WorkspaceMemberGuard } from './guards/workspace-member.guard';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceAdminGuard, WorkspaceMemberGuard]
})
export class WorkspaceModule {}
