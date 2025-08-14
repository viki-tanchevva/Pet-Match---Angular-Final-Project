import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retryWhen, mergeMap, timer, throwError } from 'rxjs';

function isRetriable(error: HttpErrorResponse, method: string): boolean {
  if (method !== 'GET') return false;
  if (error.status === 0) return true;
  if (error.status === 502 || error.status === 503 || error.status === 504) return true;
  return false;
}

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const maxAttempts = 2;
  const baseDelay = 300;
  return next(req).pipe(
    retryWhen(errors =>
      errors.pipe(
        mergeMap((error: any, index: number) => {
          const attempt = index + 1;
          if (error instanceof HttpErrorResponse && isRetriable(error, req.method) && attempt <= maxAttempts) {
            const delayMs = baseDelay * attempt;
            return timer(delayMs);
          }
          return throwError(() => error);
        })
      )
    )
  );
};
