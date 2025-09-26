import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { Prisma } from '@prisma/client';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Post()
  create(@Body() data: Prisma.ActivityLogCreateInput) {
    return this.activityLogsService.create(data);
  }

  @Get()
  findAll() {
    return this.activityLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityLogsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityLogsService.remove(+id);
  }
}
