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
  templateUrl: './login.html',
  styleUrls: ['./login.css'] 
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router); //  Para navegación
  
  userData = { email: '', password: '' };
  message = '';
  loading = false; // Estado de carga

  login() {
    this.loading = true;
    this.message = '';
    
    this.auth.login(this.userData).subscribe({
      next: (res: any) => {
        this.auth.setUser(res.user, res.token);
        this.message = 'Inicio de sesión correcto';
        this.loading = false;
        
        // Redirigir al catálogo después de login exitoso
        setTimeout(() => {
          this.router.navigate(['/catalog']);
        }, 1000);
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
        this.message = 'Usuario registrado correctamente';
        this.loading = false;
        
        // Auto-login después de registro
        // this.auth.setUser(res.user, res.token);
      },
      error: (err) => {
        this.message = err.error?.msg || 'Error al registrarse';
        this.loading = false;
      }
    });
  }

  // Método para limpiar formulario
  clearForm() {
    this.userData = { email: '', password: '' };
    this.message = '';
  }
}
