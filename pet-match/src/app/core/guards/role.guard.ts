import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services';

function normalize(r: any): 'User' | 'Shelter' | null {
  const v = String(r || '').toLowerCase();
  if (v === 'shelter') return 'Shelter';
  if (v === 'user') return 'User';
  return null;
}

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const required = ((route.data?.['roles'] as string[] | undefined) || []).map(x => String(x).toLowerCase());
  if (required.length === 0) return true;
  const role = normalize(auth.userRole());
  if (role && required.includes(role.toLowerCase())) return true;
  return router.parseUrl('/home');
};
