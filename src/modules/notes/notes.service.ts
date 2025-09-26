import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Note } from '@prisma/client';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.NoteCreateInput): Promise<Note> {
    return this.prisma.note.create({ data });
  }

  findAll(): Promise<Note[]> {
    return this.prisma.note.findMany();
  }

  findOne(id: number): Promise<Note | null> {
    return this.prisma.note.findUnique({ where: { id } });
  }

  update(id: number, data: Prisma.NoteUpdateInput): Promise<Note> {
    return this.prisma.note.update({ where: { id }, data });
  }

  remove(id: number): Promise<Note> {
    return this.prisma.note.delete({ where: { id } });
  }
}
