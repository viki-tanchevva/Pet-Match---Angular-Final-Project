import { HttpInterceptorFn } from '@angular/common/http';

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function resolveToken(): string | null {
  if (typeof window === 'undefined') return null;
  const candidates = ['accessToken', 'token', 'authToken', 'jwt'];
  for (const key of candidates) {
    const v = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (v && v.trim()) return v.trim();
  }
  const cookieCandidates = ['accessToken', 'token', 'auth', 'jwt'];
  for (const key of cookieCandidates) {
    const v = readCookie(key);
    if (v && v.trim()) return v.trim();
  }
  return null;
}

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = resolveToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Authorization': token
      }
    });
  }
  return next(req);
};
