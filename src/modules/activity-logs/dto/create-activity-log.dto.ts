import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityLogDto {
  @ApiProperty({ example: 'Tạo ticket mới' })
  @IsString()
  action!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  ticketId!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  createdById!: number;
}
