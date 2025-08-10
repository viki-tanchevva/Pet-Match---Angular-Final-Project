import { Injectable, Inject, PLATFORM_ID, signal } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import { User } from "../../models";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';
    private _isLoggedIn = signal<boolean>(false);
    private _currentUser = signal<User | null>(null);
    private _userRole = signal<'User' | 'Shelter' | null>(null);

    public isLoggedIn = this._isLoggedIn.asReadonly();
    public currentUser = this._currentUser.asReadonly();
    public userRole = this._userRole.asReadonly();

    private isBrowser: boolean;

    constructor(
        private httpClient: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);

        if (this.isBrowser) {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                const user = JSON.parse(savedUser);
                this._currentUser.set(user);
                this._isLoggedIn.set(true);
                this._userRole.set(user.role);
            }
        }
    }

    login(email: string, password: string): Observable<User> {
        return this.httpClient.post<User>(`${this.apiUrl}/login`, {email, password}, {
            withCredentials: true
        }).pipe(
            tap(user => {
                this._currentUser.set(user);
                this._isLoggedIn.set(true);
                this._userRole.set(user.role);
                if (this.isBrowser) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            })
        )
    }

    register(username: string, email: string, password: string, rePassword: string, role: 'user' | 'shelter'): Observable<User> {
        return this.httpClient.post<User>(`${this.apiUrl}/register`, {
            username,
            email,
            password, 
            rePassword, 
            role
        }, {
            withCredentials: true
        }).pipe(
            tap(user => {
                this._currentUser.set(user);
                this._isLoggedIn.set(true);
                this._userRole.set(user.role);
                if (this.isBrowser) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            })
        );
    }

    logout(): Observable<void> {
        return this.httpClient.post<void>(`${this.apiUrl}/logout`, {}, {
            withCredentials: true
        }).pipe(
            tap(() => {
                this._currentUser.set(null);
                this._isLoggedIn.set(false);
                this._userRole.set(null);
                if (this.isBrowser) {
                    localStorage.removeItem('currentUser');
                }
            })
        )
    }

    getCurrentUserId(): string | null {
        return this._currentUser()?._id || null;
    }

}
