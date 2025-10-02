import { IsString, IsOptional, IsInt, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketPriority, TicketType } from '@prisma/client';
import { TicketStatus } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty({ example: 'Lỗi đăng nhập' })
  @IsString()
  title!: string;

  @ApiProperty({
    example: 'Không thể đăng nhập với tài khoản abc',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1, description: 'ID khách hàng' })
  @IsInt()
  customerId!: number;

  @ApiProperty({
    example: 2,
    required: false,
    description: 'ID người được assign',
  })
  @IsOptional()
  @IsInt()
  assignedToId?: number;

  // sau này implement enum
  @ApiProperty({ example: 'OPEN', enum: TicketStatus, required: false })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiProperty({ example: 'HIGH', enum: TicketPriority, required: false })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiProperty({ example: 'INCIDENT', enum: TicketType, required: false })
  @IsOptional()
  @IsEnum(TicketType)
  type?: TicketType;

  @ApiProperty({ example: ['bug', 'login'], required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    example: [3, 4],
    required: false,
    description: 'Danh sách userId follower',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  followerIds?: number[];
}
