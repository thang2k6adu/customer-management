import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'oldpassword123', description: 'Mật khẩu cũ' })
  @IsString()
  oldPassword!: string;

  @ApiProperty({
    example: 'newpassword456',
    description: 'Mật khẩu mới, tối thiểu 6 ký tự',
  })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}
