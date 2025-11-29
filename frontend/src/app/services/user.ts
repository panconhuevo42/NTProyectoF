// frontend/src/app/services/user.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {  // ✅ CAMBIAR: UserService (no User)
  private http = inject(HttpClient);
  private baseUrl = '/api/users';

  recargarWallet(data: { userId: string, amount: number }) {
    return this.http.post(`${this.baseUrl}/wallet/add`, data);
  }

  obtenerUsuario(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  actualizarUsuario(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  obtenerUsuarios() {
    return this.http.get(this.baseUrl);
  }
}