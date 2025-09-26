import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Công ty ABC' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'abc@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '0123456789', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '123 Đường Lê Lợi, HN', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}
