import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export class GameService {
  private http = inject(HttpClient); // Nuevo sistema de inyección

  private baseUrl = 'http://localhost:5000/api/juegos'; // o usar environment.apiUrl

  getJuegos() {
    return this.http.get(this.baseUrl);
  }

  createJuego(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  updateJuego(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteJuego(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

