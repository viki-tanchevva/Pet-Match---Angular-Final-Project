import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';

function readUser(): any {
  const keys = ['user', 'currentUser', 'auth', 'profile', 'userData', 'account'];
  for (const k of keys) {
    const raw = localStorage.getItem(k);
    if (!raw) continue;
    try { return JSON.parse(raw); } catch { /* ignore */ }
  }
  return null;
}

function normalizeRole(u: any): string {
  let role: any =
    u?.role ??
    (Array.isArray(u?.roles) ? u.roles[0] : undefined) ??
    (u?.isShelter ? 'Shelter' : u?.isUser ? 'User' : undefined) ??
    u?.userType ??
    u?.type ??
    '';
  role = String(role).trim().toLowerCase();
  if (role === 'shelter') return 'Shelter';
  if (role === 'user') return 'User';
  return role ? role.charAt(0).toUpperCase() + role.slice(1) : '';
}

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const router = inject(Router);
  const user = readUser();
  if (!user) return router.parseUrl('/login');

  const required = ((route.data?.['roles'] as string[] | undefined) ?? []).map(r => String(r).toLowerCase());
  const userRoleNorm = normalizeRole(user);
  const userRoleLower = userRoleNorm.toLowerCase();

  const hasFlagShelter = !!user?.isShelter || (Array.isArray(user?.roles) && user.roles.map((r: any) => String(r).toLowerCase()).includes('shelter'));
  const ok =
    required.length === 0 ||
    required.includes(userRoleLower) ||
    (required.includes('shelter') && hasFlagShelter);

  return ok ? true : router.parseUrl('/home');
};
