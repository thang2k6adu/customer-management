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
  async create(
    @Param('ticketId') ticketId: string,
    @Body() dto: CreateConversationDto,
    @Req() req: AuthRequest,
  ) {
    // Không lấy createdById từ client nữa, dùng req.user
    const data = await this.conversationsService.create(
      dto,
      req.user.userId,
      +ticketId,
    );

    return {
      message: 'Tạo conversation thành công',
      data,
    };
  }

  @Get()
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Lấy tất cả conversation của ticket' })
  async findAll(@Param('ticketId') ticketId: string, @Req() req: AuthRequest) {
    const data = await this.conversationsService.findAllByTicket(
      +ticketId,
      req.user.userId,
    );

    return {
      message: 'Lấy danh sách conversation thành công',
      data,
    };
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Lấy conversation theo ID' })
  async findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    const data = await this.conversationsService.findOne(+id, req.user.userId);

    return {
      message: 'Lấy thông tin conversation thành công',
      data,
    };
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Cập nhật conversation (chỉ creator)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateConversationDto,
    @Req() req: AuthRequest,
  ) {
    const data = await this.conversationsService.update(
      +id,
      dto,
      req.user.userId,
    );

    return {
      message: 'Cập nhật conversation thành công',
      data,
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Xóa conversation (chỉ creator)' })
  async remove(@Param('id') id: string, @Req() req: AuthRequest) {
    const data = await this.conversationsService.remove(+id, req.user.userId);

    return {
      message: 'Xóa conversation thành công',
      data,
    };
  }
}
