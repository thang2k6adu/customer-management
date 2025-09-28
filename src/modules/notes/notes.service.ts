import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Note } from '@prisma/client';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNoteDto, userId: number): Promise<Note> {
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
      throw new ForbiddenException('No permission to add note to this ticket');

    return this.prisma.note.create({
      data: {
        content: dto.content,
        ticket: { connect: { id: dto.ticketId } },
        createdBy: { connect: { id: userId } },
      },
    });
  }

  async findAllByTicket(ticketId: number, userId: number): Promise<Note[]> {
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
        'No permission to view notes for this ticket',
      );

    return this.prisma.note.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: number, userId: number): Promise<Note> {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: {
        ticket: {
          include: { followers: true, assignedTo: true, createdBy: true },
        },
      },
    });
    if (!note) throw new NotFoundException('Note not found');

    const ticket = note.ticket;
    const isMember =
      ticket.createdById === userId ||
      ticket.assignedToId === userId ||
      ticket.followers.some((f) => f.id === userId);

    if (!isMember)
      throw new ForbiddenException('No permission to view this note');

    return note;
  }

  async update(
    id: number,
    dto: UpdateNoteDto,
    userId: number,
    isAdmin = false,
  ): Promise<Note> {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');

    if (!isAdmin && note.createdById !== userId)
      throw new ForbiddenException(
        'Cannot update note created by another user',
      );

    return this.prisma.note.update({ where: { id }, data: dto });
  }

  async remove(id: number, userId: number, isAdmin = false): Promise<Note> {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');

    if (!isAdmin && note.createdById !== userId)
      throw new ForbiddenException(
        'Cannot delete note created by another user',
      );

    return this.prisma.note.delete({ where: { id } });
  }
}
