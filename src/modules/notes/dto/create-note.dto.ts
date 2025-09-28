import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ example: 'Nội dung note' })
  @IsString()
  content!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  ticketId!: number;
}
