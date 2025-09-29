// common/interfaces/api-response.interface.ts
export interface RawResponse<T> {
  message?: string;
  data: T;
  error?: boolean;
}
