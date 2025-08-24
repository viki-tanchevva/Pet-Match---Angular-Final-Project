import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';
import { map, catchError, of } from 'rxjs';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // ако вече знаем, че е логнат → 404
  if (auth.isAuthenticated()) return router.parseUrl('/404');

  // иначе опитай да ре-хидратираш от cookie-то
  return auth.profile().pipe(
    map(() => router.parseUrl('/404')), // има валидна сесия → 404
    catchError(() => of(true))          // няма сесия → пуска госта към /login
  );
};
