import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create({
      title: createTicketDto.title,
      description: createTicketDto.description,
      status: createTicketDto.status,
      createdBy: { connect: { id: createTicketDto.createdById } },
      customer: { connect: { id: createTicketDto.customerId } },
      assignedTo: createTicketDto.assignedToId
        ? { connect: { id: createTicketDto.assignedToId } }
        : undefined,
    });
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
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
