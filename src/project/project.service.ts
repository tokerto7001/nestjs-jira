import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { WorkSpaceRole } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prismaService: PrismaService) {}

  create(workspaceId: number, projectAttr: CreateProjectDto) {
    return this.prismaService.project.create({
      data: {
        ...projectAttr,
        workspaceId,
      }
    }).catch((err) => {
      if(err.code === 'P2003') throw new NotFoundException('Workspace not found');
      if(err.code === 'P2002') throw new NotFoundException('Project name already exists');
      throw err;
    })
  }

  getProjects(workspaceId: number) {
    return this.prismaService.project.findMany({
      where: {
        workspaceId
      }
    });
  }

  getProject(projectId: number) {
    return this.prismaService.project.findUnique({
      where: {
        id: projectId,
      }
    });
  }

  addToProject(projectId: number, userId: number) {
    return this.prismaService.projectMembers.create({
      data: {
        projectId,
        userId,
      }
    }).catch((err) => {
      if(err.code === 'P2003') throw new NotFoundException('Project or user not found');
      else if(err.code === 'P2002') throw new BadRequestException('User is already a member');
      throw err;
    })
  }

  updateProject(projectId: number, projectAttr: UpdateProjectDto) {
    return this.prismaService.project.update({
      where: {
        id: projectId
      },
      data: {
        ...projectAttr
      }
    }).catch((err) => {
      if(err.code === 'P2003') throw new NotFoundException('Project not found');
      if(err.code === 'P2002') throw new NotFoundException('Project name already exists');
      throw err;
    })
  }

  updateMemberRole(projectId: number, userId: number, role: WorkSpaceRole) {
    return this.prismaService.projectMembers.updateMany({
      where: {
        projectId,
        userId,
      },
      data: {
        role,
      }
    })
  }

  getProjectMembers(projectId: number) {
    return this.prismaService.projectMembers.findMany({
      where: {
        projectId,
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          }
        }
      }
    })
  }

  getMyProjects(workspaceId: number, userId: number) {
    return this.prismaService.projectMembers.findMany({
      where: {
        userId,
        project: {
          workspaceId,
        }
      },
      include: {
        project: true
      }
    })
  }

  exitFromProject(projectId: number, userId: number) {
    return this.prismaService.projectMembers.deleteMany({
      where: {
        projectId,
        userId,
      }
    })
  }

  // this handler is written separately than exitFromProject upwards
  // to assure that these are 2 different features and this may include
  // different stuff than  the other one
  removeFromProject(projectId: number, userId: number) {
    return this.prismaService.projectMembers.deleteMany({
      where: {
        projectId,
        userId
      }
    })
  }

  deleteProject(projectId: number) {
    const deleteMembers = this.prismaService.projectMembers.deleteMany({
      where: { projectId }
    });
    const deleteProject = this.prismaService.project.deleteMany({
      where: { id: projectId }
    });

    return this.prismaService.$transaction([
      deleteMembers,
      deleteProject
    ])
  }
}
