import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

@Module({
  imports: [ActivityLogsModule], // Import module có export service
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
