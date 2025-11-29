// frontend/src/app/services/game.ts


import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameService {  // ✅ CAMBIAR: GameService (no Game)
  private http = inject(HttpClient);
  private baseUrl = '/api/games';

  getJuegos() {
    return this.http.get(this.baseUrl);
  }

  getProximosJuegos() {
    return this.http.get(`${this.baseUrl}/upcoming`);
  }

  getJuegoPorId(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`);
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