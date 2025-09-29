import { RawResponse } from 'src/common/interfaces/raw-response.interface';

export function isRawResponse<T>(res: unknown): res is RawResponse<T> {
  return (
    !!res && typeof res === 'object' && ('message' in res || 'data' in res)
  );
}
