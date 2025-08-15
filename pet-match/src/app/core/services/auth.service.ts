import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../../models';

type LoginDto = { email: string; password: string; };
type RegisterDto = { username: string; email: string; password: string; rePassword?: string; role?: 'User' | 'Shelter'; };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private _isLoggedIn = signal<boolean>(false);
  private _currentUser = signal<User | null>(null);
  private _userRole = signal<'User' | 'Shelter' | null>(null);

  public isLoggedIn = this._isLoggedIn.asReadonly();
  public currentUser = this._currentUser.asReadonly();
  public userRole = this._userRole.asReadonly();

  constructor(private http: HttpClient) {}

  register(body: RegisterDto): Observable<User>;
  register(username: string, email: string, password: string, rePassword?: string, role?: 'User' | 'Shelter'): Observable<User>;
  register(a: any, b?: any, c?: any, d?: any, e?: any): Observable<User> {
    const payload: RegisterDto =
      typeof a === 'object'
        ? a
        : { username: a, email: b, password: c, rePassword: d, role: e };
    return this.http.post<User>(`${this.apiUrl}/register`, payload, { withCredentials: true }).pipe(
      tap(u => { this._currentUser.set(u); this._userRole.set((u as any).role || null); this._isLoggedIn.set(true); })
    );
  }

  login(body: LoginDto): Observable<User>;
  login(email: string, password: string): Observable<User>;
  login(a: any, b?: any): Observable<User> {
    const payload: LoginDto =
      typeof a === 'object'
        ? a
        : { email: a, password: b };
    return this.http.post<User>(`${this.apiUrl}/login`, payload, { withCredentials: true }).pipe(
      tap(u => { this._currentUser.set(u); this._userRole.set((u as any).role || null); this._isLoggedIn.set(true); })
    );
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => { this._currentUser.set(null); this._userRole.set(null); this._isLoggedIn.set(false); })
    );
  }

  profile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`, { withCredentials: true }).pipe(
      tap(u => { this._currentUser.set(u); this._userRole.set((u as any).role || null); this._isLoggedIn.set(true); })
    );
  }

  isAuthenticated(): boolean {
    return this._isLoggedIn();
  }

  getCurrentUserId(): string | null {
    return this._currentUser()?._id || null;
  }
}
