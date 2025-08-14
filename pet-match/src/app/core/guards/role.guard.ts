import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';

function extractRole(auth: any): string | null {
  try { if (typeof auth.userRole === 'function') return auth.userRole(); } catch {}
  try {
    const u = typeof auth.user === 'function' ? auth.user() : auth.user;
    if (u && typeof u === 'object') {
      if (typeof u.role === 'string') return u.role;
      if (typeof u.type === 'string') return u.type;
      if (Array.isArray(u.roles) && u.roles.length) return u.roles[0];
    }
  } catch {}
  const roleFromStorage = localStorage.getItem('role') || sessionStorage.getItem('role');
  if (roleFromStorage && roleFromStorage.trim()) return roleFromStorage.trim();
  return null;
}

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService) as any;
  const router = inject(Router);
  const roles = (route.data?.['roles'] as string[]) || [];
  if (!roles.length) return true;
  const current = extractRole(auth);
  if (current && roles.includes(current)) return true;
  return router.createUrlTree(['/home']);
};
