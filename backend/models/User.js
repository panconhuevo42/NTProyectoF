// frontend/src/app/components/login/login.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  
  userData = { username: '', email: '', password: '' };
  message = '';
  loading = false;
  isLoginMode = true;

  onSubmit() {
    if (this.isLoginMode) {
      this.login();
    } else {
      this.register();
    }
  }

  login() {
    this.loading = true;
    this.message = '';
    
    const loginData = {
      email: this.userData.email,
      password: this.userData.password
    };
    
    this.auth.login(loginData).subscribe({
      next: (res: any) => {
        this.message = '✅ Inicio de sesión correcto';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/catalog']), 1000);
      },
      error: (err) => {
        this.message = err.error?.msg || 'Error al iniciar sesión';
        this.loading = false;
      }
    });
  }

  register() {
    this.loading = true;
    this.message = '';
    
    this.auth.register(this.userData).subscribe({
      next: (res: any) => {
        this.message = '✅ Usuario registrado correctamente';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/catalog']), 1000);
      },
      error: (err) => {
        this.message = err.error?.msg || 'Error al registrarse';
        this.loading = false;
      }
    });
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.message = '';
    this.userData = { 
      username: this.isLoginMode ? '' : this.userData.username, 
      email: this.userData.email, 
      password: this.userData.password 
    };
  }

  // ✅ CORREGIDO - Limpiar todos los campos
  clearForm() {
    this.userData = { username: '', email: '', password: '' };
    this.message = '';
  }
}
