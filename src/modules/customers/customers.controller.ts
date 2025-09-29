import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles(Role.MEMBER, Role.ADMIN)
  @ApiOperation({ summary: 'Tạo khách hàng mới (admin & member)' })
  @ApiResponse({ status: 201, description: 'Khách hàng được tạo thành công' })
  async create(
    @Req() req: AuthRequest,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    const data = {
      ...createCustomerDto,
      createdBy: { connect: { id: req.user.userId } },
    };

    const result = await this.customersService.create(data);

    return {
      message: 'Tạo khách hàng thành công',
      data: result,
    };
  }

  @Get()
  @Roles(Role.MEMBER, Role.ADMIN)
  @ApiOperation({
    summary: 'Lấy danh sách khách hàng (admin all & member own client)',
  })
  @ApiResponse({ status: 200, description: 'Danh sách khách hàng' })
  async findAll(@Req() req: AuthRequest) {
    const where =
      req.user.role === Role.MEMBER
        ? { createdById: req.user.userId }
        : undefined;

    const data = await this.customersService.findAll(where);

    return {
      message: 'Lấy danh sách khách hàng thành công',
      data,
    };
  }

  @Get(':id')
  @Roles(Role.MEMBER, Role.ADMIN)
  @ApiOperation({
    summary: 'Lấy thông tin khách hàng theo ID (own client & admin get all)',
  })
  @ApiResponse({ status: 200, description: 'Thông tin khách hàng' })
  async findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    const customer = await this.customersService.findOne(+id);
    if (!customer) {
      return {
        message: 'Không tìm thấy khách hàng',
        data: null,
      };
    }

    if (
      req.user.role === Role.MEMBER &&
      customer.createdById !== req.user.userId
    ) {
      throw new ForbiddenException('Không có quyền xem khách hàng này');
    }

    return {
      message: 'Lấy thông tin khách hàng thành công',
      data: customer,
    };
  }

  @Put(':id')
  @Roles(Role.MEMBER, Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thông tin khách hàng' })
  @ApiResponse({ status: 200, description: 'Khách hàng đã được cập nhật' })
  async update(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const customer = await this.customersService.findOne(+id);
    if (!customer) {
      return {
        message: 'Không tìm thấy khách hàng',
        data: null,
      };
    }

    if (
      req.user.role === Role.MEMBER &&
      customer.createdById !== req.user.userId
    ) {
      throw new ForbiddenException('Không có quyền cập nhật khách hàng này');
    }

    const data = await this.customersService.update(+id, updateCustomerDto);

    return {
      message: 'Cập nhật thông tin khách hàng thành công',
      data,
    };
  }

  @Delete(':id')
  @Roles(Role.MEMBER, Role.ADMIN)
  @ApiOperation({ summary: 'Xóa khách hàng' })
  @ApiResponse({ status: 200, description: 'Khách hàng đã được xóa' })
  async remove(@Param('id') id: string, @Req() req: AuthRequest) {
    const customer = await this.customersService.findOne(+id);
    if (!customer) {
      return {
        message: 'Không tìm thấy khách hàng',
        data: null,
      };
    }

    if (
      req.user.role === Role.MEMBER &&
      customer.createdById !== req.user.userId
    ) {
      throw new ForbiddenException('Không có quyền xóa khách hàng này');
    }

    const data = await this.customersService.remove(+id);

    return {
      message: 'Xóa khách hàng thành công',
      data,
    };
  }
}
