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
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets/:ticketId/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Thêm note vào ticket' })
  create(
    @Param('ticketId') ticketId: string,
    @Body() dto: CreateNoteDto,
    @Req() req: AuthRequest,
  ) {
    return this.notesService.create(
      { ...dto, ticketId: +ticketId },
      req.user.userId,
    );
  }

  @Get()
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Lấy tất cả note của ticket' })
  findAll(@Param('ticketId') ticketId: string, @Req() req: AuthRequest) {
    return this.notesService.findAllByTicket(+ticketId, req.user.userId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Lấy note theo ID' })
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.notesService.findOne(+id, req.user.userId);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Cập nhật note (chỉ creator hoặc admin)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
    @Req() req: AuthRequest,
  ) {
    const isAdmin = req.user.role === Role.ADMIN;
    return this.notesService.update(+id, dto, req.user.userId, isAdmin);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Xóa note (chỉ creator hoặc admin)' })
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    const isAdmin = req.user.role === Role.ADMIN;
    return this.notesService.remove(+id, req.user.userId, isAdmin);
  }
}
