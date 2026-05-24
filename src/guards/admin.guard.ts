import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { Request } from "express";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    if(request.user!.role !== UserRole.ADMIN) throw new ForbiddenException();
    return true;
  }
}