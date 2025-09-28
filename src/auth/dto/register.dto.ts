import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'Nguyen Van A', description: 'Tên người dùng' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'abc@example.com', description: 'Email đăng nhập' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'Mật khẩu, tối thiểu 6 ký tự',
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'MEMBER', enum: Role, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
