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
  // ❌ ELIMINA styleUrls si usas CSS global
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  
  userData = { email: '', password: '' };
  message = '';
  loading = false;
  isLoginMode = true; // ✅ Para cambiar entre login/registro

  // ✅ Método único para submit
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
    
    this.auth.login(this.userData).subscribe({
      next: (res: any) => {
        this.message = '✅ Inicio de sesión correcto';
        this.loading = false;
        
        // Redirigir al catálogo
        setTimeout(() => {
          this.router.navigate(['/catalog']);
        }, 1000);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.message = err.error?.message || err.error?.msg || 'Error al iniciar sesión';
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
        
        // Auto-login después de registro
        setTimeout(() => {
          this.router.navigate(['/catalog']);
        }, 1000);
      },
      error: (err) => {
        console.error('Register error:', err);
        this.message = err.error?.message || err.error?.msg || 'Error al registrarse';
        this.loading = false;
      }
    });
  }

  // ✅ Cambiar entre login y registro
  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.message = '';
    this.userData = { email: '', password: '' };
  }

  clearForm() {
    this.userData = { email: '', password: '' };
    this.message = '';
  }
}
