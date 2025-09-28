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
  create(
    @Param('ticketId') ticketId: string,
    @Body() dto: CreateTaskDto,
    @Req() req: AuthRequest,
  ) {
    return this.tasksService.create(
      { ...dto, ticketId: +ticketId },
      req.user.userId,
    );
  }

  @Get()
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Lấy tất cả task của ticket' })
  findAll(@Param('ticketId') ticketId: string, @Req() req: AuthRequest) {
    return this.tasksService.findAllByTicket(+ticketId, req.user.userId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Lấy task theo ID' })
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.tasksService.findOne(+id, req.user.userId);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Cập nhật task (chỉ creator hoặc admin)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: AuthRequest,
  ) {
    const isAdmin = req.user.role === Role.ADMIN;
    return this.tasksService.update(+id, dto, req.user.userId, isAdmin);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Xóa task (chỉ creator hoặc admin)' })
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    const isAdmin = req.user.role === Role.ADMIN;
    return this.tasksService.remove(+id, req.user.userId, isAdmin);
  }
}
