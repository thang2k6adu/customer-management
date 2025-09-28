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
  ForbiddenException,
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
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách tất cả user (admin)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({
    summary: 'Lấy thông tin user theo id (admin hoặc chính user)',
  })
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    const userId = req.user.userId;
    if (req.user.role === Role.MEMBER && +id !== userId) {
      throw new ForbiddenException('Không có quyền xem user này');
    }
    return this.usersService.findOne(+id);
  }

  @Put('password')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Cập nhật mật khẩu (chỉ chính user)' })
  updatePassword(
    @Req() req: AuthRequest,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = req.user.userId;
    return this.usersService.updatePassword(userId, updatePasswordDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Cập nhật user (admin hoặc chính user)' })
  update(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (req.user.role === Role.MEMBER && +id !== req.user.userId) {
      throw new ForbiddenException('Không có quyền cập nhật user này');
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Xóa user (admin)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
