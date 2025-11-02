import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private http = inject(HttpClient);
  private baseUrl = '/api/reservations'; // usa '/api/reservations' si en backend está en inglés

  // Obtener todas las reservas
  getReservas(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // Crear una nueva reserva
  crearReserva(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // Actualizar una reserva existente
  actualizarReserva(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // Eliminar una reserva
  eliminarReserva(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
