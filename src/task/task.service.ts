import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from './dtos/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}

  async create(projectId: number, taskAttr: CreateTaskDto) {
    if(taskAttr.assigneeId) {
      const isMember = await this.prismaService.projectMembers.findFirst({
        where: {
          userId: taskAttr.assigneeId,
          projectId,
        }
      });
      if(!isMember) throw new BadRequestException('User is not a member of the project');
    }

    return this.prismaService.task.create({
      data: {
        ...taskAttr,
        projectId,
      }
    }).catch((err) => {
      if(err.code === 'P2003') throw new NotFoundException('Project not found');
      throw err;
    })
  }

  getTasks(projectId: number, limit: number = 10, offset: number = 0,) {
    return this.prismaService.task.findMany({
      where: {
        projectId,
      },
      skip: offset,
      take: limit,
      include: {
        assignee: {
          select: {
            email: true,
            name: true,
          }
        }
      }
    });
  }

  getTask(projectId: number, taskId: number) {
    return this.prismaService.task.findFirst({
      where: {
        projectId,
        id: taskId,
      },
      include: {
        assignee: {
          select: {
            email: true,
            name: true,
          }
        }
      }
    })
  }
}
