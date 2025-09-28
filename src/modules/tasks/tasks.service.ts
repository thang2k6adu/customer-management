import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTaskDto, userId: number): Promise<Task> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: dto.ticketId },
      include: { followers: true, assignedTo: true, createdBy: true },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const isMember =
      ticket.createdById === userId ||
      ticket.assignedToId === userId ||
      ticket.followers.some((f) => f.id === userId);

    if (!isMember)
      throw new ForbiddenException(
        'No permission to create task for this ticket',
      );

    return this.prisma.task.create({
      data: {
        content: dto.content,
        status: dto.status ?? 'PENDING',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        ticket: { connect: { id: dto.ticketId } },
        createdBy: { connect: { id: userId } },
        assignedTo: dto.assignedToId
          ? { connect: { id: dto.assignedToId } }
          : undefined,
      },
    });
  }

  async findAllByTicket(ticketId: number, userId: number): Promise<Task[]> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { followers: true, assignedTo: true, createdBy: true },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const isMember =
      ticket.createdById === userId ||
      ticket.assignedToId === userId ||
      ticket.followers.some((f) => f.id === userId);

    if (!isMember)
      throw new ForbiddenException(
        'No permission to view tasks for this ticket',
      );

    return this.prisma.task.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        ticket: {
          include: { followers: true, assignedTo: true, createdBy: true },
        },
      },
    });
    if (!task) throw new NotFoundException('Task not found');

    const ticket = task.ticket;
    const isMember =
      ticket.createdById === userId ||
      ticket.assignedToId === userId ||
      ticket.followers.some((f) => f.id === userId);

    if (!isMember)
      throw new ForbiddenException('No permission to view this task');

    return task;
  }

  async update(
    id: number,
    dto: UpdateTaskDto,
    userId: number,
    isAdmin = false,
  ): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    if (!isAdmin && task.createdById !== userId)
      throw new ForbiddenException(
        'Cannot update task created by another user',
      );

    return this.prisma.task.update({ where: { id }, data: dto });
  }

  async remove(id: number, userId: number, isAdmin = false): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    if (!isAdmin && task.createdById !== userId)
      throw new ForbiddenException(
        'Cannot delete task created by another user',
      );

    return this.prisma.task.delete({ where: { id } });
  }
}
