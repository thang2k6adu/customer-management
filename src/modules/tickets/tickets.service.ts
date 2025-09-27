import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Ticket } from '@prisma/client';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        type: dto.type,
        tags: dto.tags,

        createdBy: { connect: { id: dto.createdById } },
        customer: { connect: { id: dto.customerId } },
        assignedTo: dto.assignedToId
          ? { connect: { id: dto.assignedToId } }
          : undefined,
        followers: dto.followerIds?.length
          ? { connect: dto.followerIds.map((id) => ({ id })) }
          : undefined,
      },
    });
  }

  findAll(): Promise<Ticket[]> {
    return this.prisma.ticket.findMany();
  }

  findOne(id: number): Promise<Ticket | null> {
    return this.prisma.ticket.findUnique({ where: { id } });
  }

  update(id: number, data: Prisma.TicketUpdateInput): Promise<Ticket> {
    return this.prisma.ticket.update({ where: { id }, data });
  }

  remove(id: number): Promise<Ticket> {
    return this.prisma.ticket.delete({ where: { id } });
  }
}
