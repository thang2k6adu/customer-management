import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { Prisma } from '@prisma/client';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  create(@Body() data: Prisma.ConversationCreateInput) {
    return this.conversationsService.create(data);
  }

  @Get()
  findAll() {
    return this.conversationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.ConversationUpdateInput) {
    return this.conversationsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationsService.remove(+id);
  }
}
