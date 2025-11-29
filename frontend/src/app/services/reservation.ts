// frontend/src/app/services/reservation.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {  // ✅ CAMBIAR: ReservationService (no Reservation)
  private http = inject(HttpClient);
  private baseUrl = '/api/reservations';

  getReservasUsuario() {
    return this.http.get(`${this.baseUrl}/my-reservations`);
  }

  crearReserva(data: { userId: string, gameId: string }) {
    return this.http.post(this.baseUrl, data);
  }

  cancelarReserva(id: string) {
    return this.http.post(`${this.baseUrl}/${id}/cancel`, {});
  }

  getTodasReservas() {
    return this.http.get(this.baseUrl);
  }
}
