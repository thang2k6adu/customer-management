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
  // exception là lỗi mà controller/service ném ra
  // host chứa contexxt của request -> truy suất req, res
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const traceId = req.traceId || 'unknown';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
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
