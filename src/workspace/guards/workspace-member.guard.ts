import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { Request } from "express";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  constructor(
    private prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const workspaceId = Number(request.params.id);
    if(isNaN(workspaceId)) throw new ForbiddenException();

    if(request.user.role === UserRole.ADMIN) return true; // system admin can proceed

    const isWorkspaceMember = await this.prismaService.workspaceUsers.findFirst({
      where: {
        userId: request.user.id,
        workspaceId,
      }
    });
    if(isWorkspaceMember) return true;
    throw new ForbiddenException();
  }
}