import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Conversation } from '@prisma/client';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateConversationDto): Promise<Conversation> {
    return this.prisma.conversation.create({
      data: {
        content: dto.content,
        channel: dto.channel,
        type: dto.type ?? 'MESSAGE',
        attachments: dto.attachments ?? [],
        senderName: dto.senderName,
        ticket: { connect: { id: dto.ticketId } },
        createdBy: { connect: { id: dto.createdById } },
      },
    });
  }

  findAll(): Promise<Conversation[]> {
    return this.prisma.conversation.findMany();
  }

  findOne(id: number): Promise<Conversation | null> {
    return this.prisma.conversation.findUnique({ where: { id } });
  }

  update(
    id: number,
    data: Prisma.ConversationUpdateInput,
  ): Promise<Conversation> {
    return this.prisma.conversation.update({ where: { id }, data });
  }

  remove(id: number): Promise<Conversation> {
    return this.prisma.conversation.delete({ where: { id } });
  }
}
