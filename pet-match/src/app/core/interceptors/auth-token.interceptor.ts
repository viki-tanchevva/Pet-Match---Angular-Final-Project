import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { AuthService } from '../services';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('http://localhost:3000/')) {
    req = req.clone({ withCredentials: true });
  }

  const auth = inject(AuthService);
  const role = (auth.userRole as any)?.();

  if (role === 'Shelter') {
    const u = req.url.toLowerCase();
    const blocksLike = u.includes('/like') || u.includes('/favourite') || u.includes('/favorite');
    const blocksAdopt = u.includes('/adopt');
    if (blocksLike || blocksAdopt) {
      return throwError(() => ({ status: 403, error: { message: 'Not allowed' } }));
    }
  }

  return next(req);
};
