import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {}
  async getHello(): Promise<string> {
    console.log(await this.prismaService.user.findMany())
    return 'Hello World!';
  }
}
