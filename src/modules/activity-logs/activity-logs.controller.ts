import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';

@ApiTags('Activity Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets/:ticketId/activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo activity log cho ticket' })
  @ApiResponse({ status: 201, description: 'Activity log được tạo thành công' })
  create(
    @Param('ticketId') ticketId: string,
    @Body() dto: CreateActivityLogDto,
    @Req() req: AuthRequest,
  ) {
    return this.activityLogsService.create(
      dto.action,
      req.user.userId,
      +ticketId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả activity log của ticket' })
  findAll(@Param('ticketId') ticketId: string) {
    return this.activityLogsService.findAllByTicket(+ticketId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết activity log theo ID của ticket' })
  findOne(@Param('id') id: string) {
    return this.activityLogsService.findOne(+id);
  }
}
