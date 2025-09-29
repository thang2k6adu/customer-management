import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      // key từ client là "files", max 10 file
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads'), // lưu file trong /uploads
        filename: (req, file, callback) => {
          // Giữ nguyên tên file gốc
          callback(null, file.originalname);
        },
      }),
    }),
  )
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    // Trả về URL truy cập file
    const urls = files.map((file) => `/uploads/${file.filename}`);
    return { urls };
  }
}
