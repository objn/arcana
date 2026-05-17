import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, AuthToken } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(this.loadUser());
  isLoggedIn = signal<boolean>(!!this.loadToken());

  private loadToken(): string | null {
    return localStorage.getItem('arcana_token');
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem('arcana_user');
    return raw ? JSON.parse(raw) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('arcana_token');
  }

  register(email: string, username: string, password: string) {
    return this.http.post<AuthToken>(`${environment.apiUrl}/auth/register`, { email, username, password }).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthToken>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  logout() {
    localStorage.removeItem('arcana_token');
    localStorage.removeItem('arcana_user');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  private handleAuth(res: AuthToken) {
    localStorage.setItem('arcana_token', res.access_token);
    localStorage.setItem('arcana_user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
    this.isLoggedIn.set(true);
  }
}
