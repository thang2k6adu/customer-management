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
  async create(
    @Param('ticketId') ticketId: string,
    @Body() dto: CreateActivityLogDto,
    @Req() req: AuthRequest,
  ) {
    const data = await this.activityLogsService.create(
      dto.action,
      req.user.userId,
      +ticketId,
    );

    return {
      message: 'Tạo activity log thành công',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả activity log của ticket' })
  async findAll(@Param('ticketId') ticketId: string) {
    const data = await this.activityLogsService.findAllByTicket(+ticketId);

    return {
      message: 'Lấy danh sách activity log thành công',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết activity log theo ID của ticket' })
  async findOne(@Param('id') id: string) {
    const data = await this.activityLogsService.findOne(+id);

    return {
      message: 'Lấy thông tin activity log thành công',
      data,
    };
  }
}
