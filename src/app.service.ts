import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor() {}
  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}
