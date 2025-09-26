import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({ example: 'Nội dung cuộc trò chuyện' })
  @IsString()
  content!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  ticketId!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  createdById!: number;
}
