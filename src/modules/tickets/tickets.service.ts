import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Ticket } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.TicketCreateInput): Promise<Ticket> {
    return this.prisma.ticket.create({ data });
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
