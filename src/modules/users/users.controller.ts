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
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      role: createUserDto.role ?? 'MEMBER',
    });

    return {
      message: 'Tạo user thành công',
      data,
    };
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách tất cả user (admin)' })
  async findAll() {
    const data = await this.usersService.findAll();

    return {
      message: 'Lấy danh sách user thành công',
      data,
    };
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({
    summary: 'Lấy thông tin user theo id (admin hoặc chính user)',
  })
  async findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    const userId = req.user.userId;
    if (req.user.role === Role.MEMBER && +id !== userId) {
      throw new ForbiddenException('Không có quyền xem user này');
    }

    const data = await this.usersService.findOne(+id);

    return {
      message: 'Lấy thông tin user thành công',
      data,
    };
  }

  @Put('password')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Cập nhật mật khẩu (chỉ chính user)' })
  async updatePassword(
    @Req() req: AuthRequest,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = req.user.userId;
    const data = await this.usersService.updatePassword(
      userId,
      updatePasswordDto,
    );

    return {
      message: 'Cập nhật mật khẩu thành công',
      data,
    };
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Cập nhật user (admin hoặc chính user)' })
  async update(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (req.user.role === Role.MEMBER && +id !== req.user.userId) {
      throw new ForbiddenException('Không có quyền cập nhật user này');
    }

    const data = await this.usersService.update(+id, updateUserDto);

    return {
      message: 'Cập nhật thông tin user thành công',
      data,
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Xóa user (admin)' })
  async remove(@Param('id') id: string) {
    const data = await this.usersService.remove(+id);

    return {
      message: 'Xóa user thành công',
      data,
    };
  }
}
