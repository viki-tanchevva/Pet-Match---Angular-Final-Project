import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: any) => {
      let message = 'An error occurred';
      if (error instanceof HttpErrorResponse) {
        if (typeof error.error === 'string' && error.error.trim()) {
          message = error.error;
        } else if (error.error && typeof error.error.message === 'string' && error.error.message.trim()) {
          message = error.error.message;
        } else if (typeof error.message === 'string' && error.message.trim()) {
          message = error.message;
        } else if (error.status) {
          message = `Request failed with status ${error.status}`;
        }
      } else if (error && typeof error.message === 'string' && error.message.trim()) {
        message = error.message;
      }
      if (typeof window !== 'undefined') {
        alert(message);
      }
      return throwError(() => error);
    })
  );
};
