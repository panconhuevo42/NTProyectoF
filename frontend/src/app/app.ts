//frontend/src/app/app.ts

import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {  
  private authService = inject(AuthService);
  private router = inject(Router);

  get isLoggedIn(): boolean {
    return this.authService.user() !== null;
  }

  get userName(): string {
    return this.authService.user()?.username || 'Usuario';
  }

  get userBalance(): number {
    return this.authService.user()?.wallet || 0;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/catalog']);
  }
}