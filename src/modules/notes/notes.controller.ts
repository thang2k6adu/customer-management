import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Prisma } from '@prisma/client';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() data: Prisma.NoteCreateInput) {
    return this.notesService.create(data);
  }

  @Get()
  findAll() {
    return this.notesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.NoteUpdateInput) {
    return this.notesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}
