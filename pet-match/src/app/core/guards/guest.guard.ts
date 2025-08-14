import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function hasToken(): boolean {
  if (typeof window === 'undefined') return false;
  const keys = ['accessToken', 'token', 'authToken', 'jwt'];
  for (const k of keys) {
    const v = localStorage.getItem(k) || sessionStorage.getItem(k) || readCookie(k);
    if (v && v.trim()) return true;
  }
  return false;
}

function getUser(auth: any): any | null {
  try {
    const u = typeof auth.user === 'function' ? auth.user() : auth.user;
    if (u && typeof u === 'object') return u;
  } catch {}
  try {
    const u2 = typeof auth.currentUser === 'function' ? auth.currentUser() : auth.currentUser;
    if (u2 && typeof u2 === 'object') return u2;
  } catch {}
  if (typeof window !== 'undefined') {
    const s = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (s) {
      try { return JSON.parse(s); } catch {}
    }
  }
  return null;
}

function isLogged(auth: any): boolean {
  try { if (typeof auth.isAuthenticated === 'function' && auth.isAuthenticated()) return true; } catch {}
  try { if (typeof auth.isLoggedIn === 'function' && auth.isLoggedIn()) return true; } catch {}
  return false;
}

export const guestGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService) as any;
  const router = inject(Router);
  const user = getUser(auth);
  if (user || isLogged(auth) || hasToken()) {
    return router.createUrlTree(['/home']);
  }
  return true;
};
