import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Fix lỗi đăng nhập' })
  @IsString()
  content!: string;

  @ApiProperty({ example: 'PENDING', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '2025-10-30T10:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: 1 }) // Ticket ID
  @IsInt()
  ticketId!: number;

  @ApiProperty({ example: 2, required: false }) // Người được assign
  @IsOptional()
  @IsInt()
  assignedToId?: number;
}
