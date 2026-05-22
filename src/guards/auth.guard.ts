import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['accessToken'];
    if (!accessToken) throw new UnauthorizedException();

    const payload: { userId: number } = await this.jwtService.verifyAsync(accessToken, { secret: process.env.jwtAccessKey });
    const user = await this.prismaService.user.findFirst({ where: { id: payload.userId }, omit: { password: true, refreshToken: true, createdAt: true } });
    if(!user) throw new UnauthorizedException();

    request.user = user;
    return true;
  }
}