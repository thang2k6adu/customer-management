import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Catch này không có tham số nên sẽ bắt mọi lỗi của hệ thống, system, run time,...
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const traceId = req.traceId || 'unknown';
    const isDev = process.env.NODE_ENV !== 'production';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = isDev
        ? exception.message
        : 'Có lỗi xảy ra, vui lòng thử lại sau.';
    } else if (exception instanceof Error) {
      message = isDev
        ? exception.message
        : 'Có lỗi xảy ra, vui lòng thử lại sau.';
    }

    res.status(status).json({
      error: true,
      code: status,
      message,
      data: null,
      traceId,
    });
  }
}
