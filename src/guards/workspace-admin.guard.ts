import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { UserRole, WorkSpaceRole } from "@prisma/client";
import { Request } from "express";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class WorkspaceAdminGuard implements CanActivate {
  constructor(
    private prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const workspaceId = Number(request.params.id || request.params.workspaceId);
    if(isNaN(workspaceId)) throw new ForbiddenException();
    if(request.user.role === UserRole.ADMIN) return true; // system admin can proceed

    const isWorkspaceAdmin = await this.prismaService.workspaceUsers.findFirst({
      where: {
        userId: request.user.id,
        role: WorkSpaceRole.ADMIN,
        workspaceId,
      }
    });
    if(isWorkspaceAdmin) return true;
    throw new ForbiddenException();
  }
}