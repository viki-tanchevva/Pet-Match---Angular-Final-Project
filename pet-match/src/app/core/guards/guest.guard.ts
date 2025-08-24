import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';
import { map, catchError, of } from 'rxjs';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return router.parseUrl('/404');

  return auth.profile().pipe(
    map(() => router.parseUrl('/404')), 
    catchError(() => of(true))          
  );
};
