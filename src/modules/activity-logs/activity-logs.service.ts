import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ActivityLog } from '@prisma/client';

@Injectable()
export class ActivityLogsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ActivityLogCreateInput): Promise<ActivityLog> {
    return this.prisma.activityLog.create({ data });
  }

  findAll(): Promise<ActivityLog[]> {
    return this.prisma.activityLog.findMany();
  }

  findOne(id: number): Promise<ActivityLog | null> {
    return this.prisma.activityLog.findUnique({ where: { id } });
  }

  remove(id: number): Promise<ActivityLog> {
    return this.prisma.activityLog.delete({ where: { id } });
  }
}
