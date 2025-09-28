import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Conversations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets/:ticketId/conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Tạo conversation mới cho ticket' })
  @ApiResponse({ status: 201, description: 'Conversation được tạo thành công' })
  create(
    @Param('ticketId') ticketId: string,
    @Body() dto: CreateConversationDto,
    @Req() req: AuthRequest,
  ) {
    // Không lấy createdById từ client nữa, dùng req.user
    return this.conversationsService.create(dto, req.user.userId, +ticketId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Lấy tất cả conversation của ticket' })
  findAll(@Param('ticketId') ticketId: string, @Req() req: AuthRequest) {
    return this.conversationsService.findAllByTicket(
      +ticketId,
      req.user.userId,
    );
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Lấy conversation theo ID' })
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.conversationsService.findOne(+id, req.user.userId);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Cập nhật conversation (chỉ creator)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateConversationDto,
    @Req() req: AuthRequest,
  ) {
    return this.conversationsService.update(+id, dto, req.user.userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Xóa conversation (chỉ creator)' })
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.conversationsService.remove(+id, req.user.userId);
  }
}
