import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Prisma } from '@prisma/client';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() data: Prisma.TicketCreateInput) {
    return this.ticketsService.create(data);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.TicketUpdateInput) {
    return this.ticketsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
