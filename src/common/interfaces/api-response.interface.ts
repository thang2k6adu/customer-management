export interface ApiResponse<T> {
  error: boolean;
  code: number;
  message: string;
  data: T;
  traceId: string;
}
