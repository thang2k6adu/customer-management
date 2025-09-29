export interface ApiResponse<T> {
  error: boolean;
  code: number;
  message: string;
  data: T | null;
  traceId: string;
}
