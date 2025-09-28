import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityLogDto {
  @ApiProperty({ example: 'Thay đổi trạng thái ticket' })
  @IsString()
  action!: string;
}
