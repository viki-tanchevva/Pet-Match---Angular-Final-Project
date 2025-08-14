import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

function now(): number {
  return typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
}

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const start = now();
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const ms = Math.round(now() - start);
        console.log(`[HTTP] ${req.method} ${req.urlWithParams} -> ${event.status} in ${ms}ms`);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const ms = Math.round(now() - start);
      const code = typeof error?.status === 'number' ? error.status : '';
      console.log(`[HTTP] ${req.method} ${req.urlWithParams} -> ERROR ${code} in ${ms}ms`);
      return throwError(() => error);
    })
  );
};
