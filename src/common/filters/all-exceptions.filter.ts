import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request & { traceId?: string }>();

    // TraceId từ request, nếu chưa có thì tạo "unknown"
    const traceId = req.traceId || 'unknown';

    const isDev = process.env.NODE_ENV !== 'production';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    // Handle HttpException (có thể trả string hoặc object)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      // HttpException có thể trả về response (object | string,...)
      const response = exception.getResponse();

      if (isDev) {
        if (typeof response === 'string') {
          message = response;
        } else if (typeof response === 'object' && response !== null) {
          // Nếu response có field message, lấy nó
          message = (response as any).message || JSON.stringify(response);
        } else {
          message = 'HttpException thrown';
        }
      } else {
        message = 'Có lỗi xảy ra, vui lòng thử lại sau.';
      }
      if (
        ![
          HttpStatus.UNAUTHORIZED,
          HttpStatus.FORBIDDEN,
          HttpStatus.NOT_FOUND,
        ].includes(status)
      ) {
        status = HttpStatus.OK;
      }
    }
    // Handle runtime errors
    else if (exception instanceof Error) {
      message = isDev
        ? `${exception.message}${isDev ? `\n${exception.stack}` : ''}`
        : 'Có lỗi xảy ra, vui lòng thử lại sau.';
      status = HttpStatus.OK; // runtime error → luôn trả 200
    }

    // Log lỗi ra console / logger
    this.logger.error(
      `TraceId: ${traceId} | ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : '',
    );

    // Gửi response chuẩn hóa cho client
    res.status(status).json({
      error: true,
      code: status,
      message,
      data: null,
      traceId,
    });
  }
}
