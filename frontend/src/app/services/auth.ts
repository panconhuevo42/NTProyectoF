// frontend/src/app/services/auth.ts


import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = '/api/auth';

  user = signal<any>(null);

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setUser(response.user, response.token);
        }
      })
    );
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setUser(response.user, response.token);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.user.set(null);
  }

  setUser(user: any, token: string) {
    localStorage.setItem('token', token);
    this.user.set(user);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

