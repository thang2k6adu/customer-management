import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Ticket, Role } from '@prisma/client';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTicketDto, userId: number) {
    const { followerIds, ...rest } = dto;
    console.log(dto);

    return this.prisma.ticket.create({
      data: {
        ...rest,
        createdById: userId,
        assignedToId: dto.assignedToId ?? undefined,
        followers: followerIds
          ? { connect: followerIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { followers: true },
    });
  }

  async findAll(user: { userId: number; role: Role }): Promise<Ticket[]> {
    if (user.role === Role.ADMIN) {
      return this.prisma.ticket.findMany();
    }

    return this.prisma.ticket.findMany({
      where: {
        OR: [
          { createdById: user.userId },
          { assignedToId: user.userId },
          { followers: { some: { id: user.userId } } },
        ],
      },
    });
  }

  // Hiện tại findOne đang return null, nếu ko thấy cũng là unauthorize -> sai lầm
  async findOne(id: number, user: { userId: number; role: Role }) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { followers: true },
    });

    if (!ticket) return null;

    if (user.role === Role.ADMIN) return ticket;

    const canView =
      ticket.createdById === user.userId ||
      ticket.assignedToId === user.userId ||
      ticket.followers.some((f) => f.id === user.userId);

    return canView ? ticket : null;
  }

  async update(
    id: number,
    dto: UpdateTicketDto,
    user: { userId: number; role: Role },
  ) {
    const ticket = await this.findOne(id, user);
    if (!ticket) throw new ForbiddenException('Không có quyền cập nhật ticket');

    const { followerIds, ...rest } = dto;

    return this.prisma.ticket.update({
      where: { id },
      data: {
        ...rest,
        followers: followerIds
          ? { set: followerIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { followers: true },
    });
  }

  async remove(id: number, user: { userId: number; role: Role }) {
    const ticket = await this.findOne(id, user);
    if (!ticket) throw new ForbiddenException('Không có quyền xóa ticket');

    return this.prisma.ticket.delete({ where: { id } });
  }
}
