import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: 1 }) // ID người tạo
  @IsInt()
  createdById!: number;

  @ApiProperty({ example: 1 }) // ID khách hàng
  @IsInt()
  customerId!: number;

  @ApiProperty({ example: 2, required: false }) // ID người được assign
  @IsOptional()
  @IsInt()
  assignedToId?: number;

  @ApiProperty({ example: 'OPEN', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
