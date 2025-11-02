
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private auth = inject(AuthService);
  userData = { email: '', password: '' };
  message = '';

  login() {
    this.auth.login(this.userData).subscribe({
      next: (res: any) => {
        this.auth.setUser(res.user, res.token);
        this.message = 'Inicio de sesión correcto';
      },
      error: err => (this.message = 'Error al iniciar sesión')
    });
  }

  register() {
    this.auth.register(this.userData).subscribe({
      next: () => (this.message = 'Usuario registrado correctamente'),
      error: () => (this.message = 'Error al registrarse')
    });
  }
}
