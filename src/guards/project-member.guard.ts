import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { UserRole, WorkSpaceRole } from "@prisma/client";
import { Request } from "express";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    private prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const projectId = Number(request.params.projectId);
    const workspaceId = Number(request.params.workspaceId);
    if(isNaN(projectId) || isNaN(workspaceId)) throw new ForbiddenException();

    if(request.user.role === UserRole.ADMIN) return true; // system admin can proceed

    const [isProjectMember, isWorkspaceAdmin] = await Promise.all([
      this.prismaService.projectMembers.findFirst({
        where: {
          userId: request.user.id,
          projectId,
        }
      }),
      this.prismaService.workspaceUsers.findFirst({
        where: {
          userId: request.user.id,
          workspaceId,
          role: WorkSpaceRole.ADMIN
        }
      }),
    ]);
    if(isProjectMember || isWorkspaceAdmin) return true;
    throw new ForbiddenException();
  }
}