import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityLog } from '@prisma/client';

@Injectable()
export class ActivityLogsService {
  constructor(private prisma: PrismaService) {}

  create(
    action: string,
    createdById: number,
    ticketId: number,
  ): Promise<ActivityLog> {
    return this.prisma.activityLog.create({
      data: {
        action,
        createdBy: { connect: { id: createdById } },
        ticket: { connect: { id: ticketId } },
      },
    });
  }

  findAllByTicket(ticketId: number): Promise<ActivityLog[]> {
    return this.prisma.activityLog.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number): Promise<ActivityLog | null> {
    return this.prisma.activityLog.findFirst({
      where: { id },
    });
  }
}
