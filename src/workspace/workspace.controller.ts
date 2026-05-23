import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import type { Request } from 'express';

@Controller('workspace')
export class WorkspaceController {
    constructor(
        private workspaceService: WorkspaceService
    ) {}

    @Post()
    @UseGuards(AuthGuard, AdminGuard)
    create(@Req() request: Request, @Body() { name }: CreateWorkspaceDto) {
        return this.workspaceService.create(request.user!.id, name);
    }
}
