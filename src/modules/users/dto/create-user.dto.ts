import { IsString, IsEnum, IsEmail, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Thang' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'thang@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  password!: string;

  @ApiProperty({ example: 'MEMBER', required: false })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
