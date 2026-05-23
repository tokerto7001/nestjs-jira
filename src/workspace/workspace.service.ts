import { Injectable } from '@nestjs/common';
import { WorkSpaceRole } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(
    private prismaService: PrismaService
  ) { }

  async create(userId: number, name: string) {
    return this.prismaService.workspace.create({
      data: {
        name,
        workspaceUsers: {
          create: [{ userId: userId, role: WorkSpaceRole.ADMIN }]
        }
      },
    })
  }
}
