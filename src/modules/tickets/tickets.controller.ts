import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Roles(Role.MEMBER, Role.ADMIN)
  @ApiOperation({ summary: 'Tạo ticket mới' })
  create(@Req() req: AuthRequest, @Body() dto: CreateTicketDto) {
    return this.ticketsService.create(dto, req.user.userId);
  }

  @Get()
  @Roles(Role.MEMBER, Role.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách ticket' })
  findAll(@Req() req: AuthRequest) {
    return this.ticketsService.findAll(req.user);
  }

  @Get(':id')
  @Roles(Role.MEMBER, Role.ADMIN)
  @ApiOperation({ summary: 'Xem chi tiết ticket' })
  async findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    const ticket = await this.ticketsService.findOne(+id, req.user);
    if (!ticket) throw new ForbiddenException('Không có quyền xem ticket này');
    return ticket;
  }

  @Put(':id')
  @Roles(Role.MEMBER, Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật ticket' })
  async update(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body() dto: UpdateTicketDto,
  ) {
    return this.ticketsService.update(+id, dto, req.user);
  }

  @Delete(':id')
  @Roles(Role.MEMBER, Role.ADMIN)
  @ApiOperation({ summary: 'Xóa ticket' })
  async remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.ticketsService.remove(+id, req.user);
  }
}
