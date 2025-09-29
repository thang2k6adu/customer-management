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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets/:ticketId/tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Tạo task trong ticket' })
  @ApiResponse({ status: 201, description: 'Task được tạo thành công' })
  async create(
    @Param('ticketId') ticketId: string,
    @Body() dto: CreateTaskDto,
    @Req() req: AuthRequest,
  ) {
    const data = await this.tasksService.create(
      { ...dto, ticketId: +ticketId },
      req.user.userId,
    );

    return {
      message: 'Tạo task thành công',
      data,
    };
  }

  @Get()
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Lấy tất cả task của ticket' })
  async findAll(@Param('ticketId') ticketId: string, @Req() req: AuthRequest) {
    const data = await this.tasksService.findAllByTicket(
      +ticketId,
      req.user.userId,
    );

    return {
      message: 'Lấy danh sách task thành công',
      data,
    };
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Lấy task theo ID' })
  async findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    const data = await this.tasksService.findOne(+id, req.user.userId);

    return {
      message: 'Lấy thông tin task thành công',
      data,
    };
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Cập nhật task (chỉ creator hoặc admin)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: AuthRequest,
  ) {
    const isAdmin = req.user.role === Role.ADMIN;
    const data = await this.tasksService.update(
      +id,
      dto,
      req.user.userId,
      isAdmin,
    );

    return {
      message: 'Cập nhật task thành công',
      data,
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Xóa task (chỉ creator hoặc admin)' })
  async remove(@Param('id') id: string, @Req() req: AuthRequest) {
    const isAdmin = req.user.role === Role.ADMIN;
    const data = await this.tasksService.remove(+id, req.user.userId, isAdmin);

    return {
      message: 'Xóa task thành công',
      data,
    };
  }
}
