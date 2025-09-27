import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth() // Swagger hiển thị Bearer token cho tất cả endpoint
@UseGuards(JwtAuthGuard) // bảo vệ toàn bộ controller
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo user mới (admin)' })
  @ApiResponse({ status: 201, description: 'User được tạo thành công' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      role: createUserDto.role ?? 'MEMBER',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả user (admin)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin user theo id (admin hoặc chính user)',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put('password')
  @ApiOperation({ summary: 'Cập nhật mật khẩu (chỉ chính user)' })
  updatePassword(
    @Req() req: AuthRequest,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = req.user.userId;
    return this.usersService.updatePassword(userId, updatePasswordDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật user (admin hoặc chính user)' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa user (admin)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
