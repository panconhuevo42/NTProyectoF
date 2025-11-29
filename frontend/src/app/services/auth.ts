// frontend/src/app/services/auth.ts


import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api/auth';

  user = signal<any>(null);

  constructor() {
    this.initializeUser(); // Inicializar usuario al cargar
  }

  // Inicializar usuario desde localStorage
  private initializeUser() {
    const token = localStorage.getItem('token');
    if (token) {
      // Decodificar el token para obtener info del usuario
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.user.set({
          id: payload.id,
          email: payload.email,
          username: payload.username,
          wallet: payload.wallet || 0
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        this.logout();
      }
    }
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data).pipe(
      tap((response: any) => {
        if (response.token && response.user) {
          this.setUser(response.user, response.token);
        }
      }),
      catchError(error => {
        console.error('Register error:', error);
        throw error;
      })
    );
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((response: any) => {
        if (response.token && response.user) {
          this.setUser(response.user, response.token);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
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

  // ✅ Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.user() !== null;
  }
}

