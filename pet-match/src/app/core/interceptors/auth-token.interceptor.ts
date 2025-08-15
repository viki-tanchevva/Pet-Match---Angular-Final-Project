import { HttpInterceptorFn } from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const isApi =
    req.url.startsWith('http://localhost:3000/') ||
    req.url.startsWith('http://127.0.0.1:3000/') ||
    req.url.startsWith('/api');

  if (isApi) {
    req = req.clone({ withCredentials: true });
  }

  return next(req);
};
