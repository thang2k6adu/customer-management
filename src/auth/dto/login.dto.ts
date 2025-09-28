import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
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
}
