import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from 'express'
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) { }
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException();

    const payload: { userId: number } = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.jwtRefreshKey });
    const user = await this.prismaService.user.findFirst({ where: { id: payload.userId, }, omit: { password: true, createdAt: true } });
    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) throw new UnauthorizedException();

    request.user = user;
    return true;
  }
}