import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({ example: 'Nội dung cuộc trò chuyện' })
  @IsString()
  content!: string;

  @ApiProperty({
    example: 'WHATSAPP',
    description: 'Kênh hội thoại: WEB, EMAIL, WHATSAPP...',
  })
  @IsString()
  channel!: string;

  @ApiProperty({
    example: 'MESSAGE',
    description: 'Loại conversation: MESSAGE, SYSTEM, EVENT',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string; // default: "MESSAGE"

  @ApiProperty({
    example: ['file1.png', 'file2.pdf'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @ApiProperty({
    example: 'System Bot',
    required: false,
    description: 'Tên sender hiển thị, dùng cho bot hoặc system',
  })
  @IsOptional()
  @IsString()
  senderName?: string;

  // Nếu sau này bật reply theo thread:
  // @ApiProperty({ example: 5, required: false, description: 'ID conversation cha (reply)' })
  // @IsOptional()
  // @IsInt()
  // parentId?: number;
}
