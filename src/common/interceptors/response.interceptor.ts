import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { nanoid } from 'nanoid';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';
import { RawResponse } from '../interfaces/raw-response.interface';
import { isRawResponse } from 'src/utils/isRawResponse';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // Lấy traceId từ header hoặc fallback
    const headerTrace = request.headers['x-request-id'];
    const traceId: string =
      typeof headerTrace === 'string' ? headerTrace : nanoid(10);

    // Gắn vào request để controller/service có thể dùng
    request.traceId = traceId;

    return next.handle().pipe(
      map((resData: RawResponse<T> | T) => {
        // Cho phép controller return { message, data } hoặc raw object
        if (isRawResponse<T>(resData)) {
          // TypeScript hiểu chắc chắn resData là RawResponse<T>
          const message = resData.message ?? 'Success';
          const data = resData.data;
          const error = resData.error ?? false;

          return { error, code: response.statusCode, message, data, traceId };
        }
        return {
          error: false,
          code: response.statusCode,
          message: 'Success',
          data: resData,
          traceId,
        };
      }),
    );
  }
}
