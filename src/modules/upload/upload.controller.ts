import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';
import type { AuthRequest } from 'src/common/interfaces/auth-request.interface';

@UseGuards(JwtAuthGuard, RolesGuard) // Bảo vệ route
@Controller('upload')
export class UploadController {
  @Post()
  @Roles(Role.ADMIN, Role.MEMBER) // chỉ admin hoặc member mới upload được
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads'),
        filename: (req, file, callback) => {
          callback(null, file.originalname); // giữ tên gốc
        },
      }),
    }),
  )
  uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: AuthRequest,
  ) {
    // req.user có thông tin user đã được giải mã từ JWT
    const userId = req.user.userId;

    // Nếu muốn, có thể tạo folder theo user:
    // ví dụ files.map(file => `/uploads/user_${userId}/${file.filename}`);

    const urls = files.map(
      (file) => `/uploads/user_${userId}/${file.filename}`,
    );
    return { userId, urls };
  }
}
