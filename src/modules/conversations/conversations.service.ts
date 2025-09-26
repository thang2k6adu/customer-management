import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Conversation } from '@prisma/client';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ConversationCreateInput): Promise<Conversation> {
    return this.prisma.conversation.create({ data });
  }

  findAll(): Promise<Conversation[]> {
    return this.prisma.conversation.findMany();
  }

  findOne(id: number): Promise<Conversation | null> {
    return this.prisma.conversation.findUnique({ where: { id } });
  }

  update(id: number, data: Prisma.ConversationUpdateInput): Promise<Conversation> {
    return this.prisma.conversation.update({ where: { id }, data });
  }

  remove(id: number): Promise<Conversation> {
    return this.prisma.conversation.delete({ where: { id } });
  }
}
