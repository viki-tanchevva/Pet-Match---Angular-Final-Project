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

function getUser(auth: any): any {
  try { if (typeof auth.user === 'function') return auth.user(); } catch {}
  try { if (auth.user && typeof auth.user !== 'function') return auth.user; } catch {}
  try { if (typeof auth.currentUser === 'function') return auth.currentUser(); } catch {}
  try { if (auth.currentUser && typeof auth.currentUser !== 'function') return auth.currentUser; } catch {}
  try { if (typeof auth.userSignal === 'function') return auth.userSignal(); } catch {}
  return null;
}

function isLogged(auth: any): boolean {
  try { if (typeof auth.isAuthenticated === 'function' && auth.isAuthenticated()) return true; } catch {}
  try { if (typeof auth.isLoggedIn === 'function' && auth.isLoggedIn()) return true; } catch {}
  return false;
}

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService) as any;
  const router = inject(Router);
  const user = getUser(auth);
  if (user || isLogged(auth) || hasToken()) return true;
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
