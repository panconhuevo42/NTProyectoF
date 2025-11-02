import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = '/api/users';

  user = signal<any>(null);

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  logout() {
    localStorage.removeItem('token');
    this.user.set(null);
  }

  setUser(user: any, token: string) {
    localStorage.setItem('token', token);
    this.user.set(user);
  }
}

