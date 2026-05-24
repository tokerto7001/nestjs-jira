import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkSpaceRole } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(
    private prismaService: PrismaService
  ) { }

  create(userId: number, name: string) {
    return this.prismaService.workspace.create({
      data: {
        name,
        workspaceUsers: {
          create: [{ userId: userId, role: WorkSpaceRole.ADMIN }]
        }
      },
    })
  }

  async update(workspaceId: number, newName: string) {
    return this.prismaService.workspace.update(
      {
        where: { id: workspaceId },
        data: {
          name: newName,
        }
      },
    ).catch((err) => {
      if(err.code === 'P2025') throw new NotFoundException()
      throw err;
    })
  }

  getAll(limit: number = 10, offset: number = 0) {
    return this.prismaService.workspace.findMany({
      take: limit,
      skip: offset,
    });
  }

  get(id: number) {
    return this.prismaService.workspace.findFirst({
      where: { id }
    });
  }

  // TODO: add other models in the transaction after implementing all related logic
  delete(id: number) {
    const deleteWorkspaceUsers = this.prismaService.workspaceUsers.deleteMany({
      where: {
        workspaceId: id
      }
    });
    
    const deleteWorkspace = this.prismaService.workspace.delete({
      where: {
        id
      }
    });

    return this.prismaService.$transaction([deleteWorkspaceUsers, deleteWorkspace, ]);
  }

  getMyWorkspaces(userId: number) {
    return this.prismaService.workspaceUsers.findMany({
      where: {
        userId,
      },
      include: {
        workspace: true
      }
    })
  }
}
