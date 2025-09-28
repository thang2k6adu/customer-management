import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Conversation } from '@prisma/client';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateConversationDto,
    userId: number,
    ticketId: number,
  ): Promise<Conversation> {
    // 1. Check ticket tồn tại & user liên quan
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { followers: true, assignedTo: true, createdBy: true },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    // Sau này thêm admin vào, giờ admin chỉ có thể xem conversation của mình
    const isMember =
      ticket.createdById === userId ||
      ticket.assignedToId === userId ||
      ticket.followers.some((f) => f.id === userId);

    if (!isMember)
      throw new ForbiddenException(
        'No permission to post conversation on this ticket',
      );

    // 2. Tạo conversation
    return this.prisma.conversation.create({
      data: {
        content: dto.content,
        channel: dto.channel,
        type: dto.type ?? 'MESSAGE',
        attachments: dto.attachments ?? [],
        senderName: dto.senderName,
        ticket: { connect: { id: ticketId } },
        createdBy: { connect: { id: userId } },
      },
    });
  }

  // Lấy tất cả conversation của ticket
  async findAllByTicket(
    ticketId: number,
    userId: number,
  ): Promise<Conversation[]> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { followers: true, assignedTo: true, createdBy: true },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    // Admin cũng ko được xem ở phần này, sau này sửa lại
    const isMember =
      ticket.createdById === userId ||
      ticket.assignedToId === userId ||
      ticket.followers.some((f) => f.id === userId);
    if (!isMember)
      throw new ForbiddenException('No permission to view conversations');

    return this.prisma.conversation.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: number, userId: number): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        ticket: {
          include: { followers: true, assignedTo: true, createdBy: true },
        },
      },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    const ticket = conversation.ticket;
    // Lặp code, sau này phân quyền lại, phân quyền tập trung
    const isMember =
      ticket.createdById === userId ||
      ticket.assignedToId === userId ||
      ticket.followers.some((f) => f.id === userId);
    if (!isMember)
      throw new ForbiddenException('No permission to view this conversation');

    return conversation;
  }

  async update(
    id: number,
    dto: UpdateConversationDto,
    userId: number,
  ): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    if (conversation.createdById !== userId)
      throw new ForbiddenException(
        'Cannot update conversation created by another user',
      );

    return this.prisma.conversation.update({ where: { id }, data: dto });
  }

  async remove(id: number, userId: number): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    if (conversation.createdById !== userId)
      throw new ForbiddenException(
        'Cannot delete conversation created by another user',
      );

    return this.prisma.conversation.delete({ where: { id } });
  }
}
