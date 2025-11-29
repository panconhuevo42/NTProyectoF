// frontend/src/app/components/reservations/reservations.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReservationService } from '../../services/reservation';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';

export interface Reservation {
  _id: string;
  userId: any;
  gameId: {
    _id: string;
    title: string;
    price: number;
    releaseDate: string;
    developer: string;
  };
  amount: number;
  status: 'active' | 'cancelled' | 'completed';
  reservationDate: string;
  cancelledAt?: string;
  completedAt?: string;
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css']
})
export class ReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);

  reservations: Reservation[] = [];
  loading: boolean = true;
  error: string = '';
  filteredStatus: string = 'all';

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.reservationService.getReservasUsuario().subscribe({
      next: (reservations: any) => {
        this.reservations = reservations;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las reservas';
        this.loading = false;
        console.error('Error loading reservations:', error);
      }
    });
  }

  cancelReservation(reservation: Reservation): void {
    if (!confirm(`¿Cancelar reserva de "${reservation.gameId.title}"? Se reembolsarán $${reservation.amount}.`)) {
      return;
    }

    this.reservationService.cancelarReserva(reservation._id).subscribe({
      next: (response: any) => {
        alert(response.message || 'Reserva cancelada y dinero reembolsado');
        // Actualizar el usuario local con el nuevo saldo
        if (response.newBalance !== undefined) {
          const currentUser = this.authService.user();
          if (currentUser) {
            this.authService.user.set({
              ...currentUser,
              wallet: response.newBalance
            });
          }
        }
        this.loadReservations(); // Recargar lista
      },
      error: (error) => {
        alert('Error al cancelar reserva: ' + (error.error?.message || 'Error desconocido'));
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return 'status-default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Activa';
      case 'cancelled': return 'Cancelada';
      case 'completed': return 'Completada';
      default: return status;
    }
  }

  canCancel(reservation: Reservation): boolean {
    return reservation.status === 'active' && 
           new Date(reservation.gameId.releaseDate) > new Date();
  }

  get filteredReservations(): Reservation[] {
    if (this.filteredStatus === 'all') {
      return this.reservations;
    }
    return this.reservations.filter(res => res.status === this.filteredStatus);
  }

  get totalSpent(): number {
    return this.reservations
      .filter(res => res.status !== 'cancelled')
      .reduce((total, res) => total + res.amount, 0);
  }

  get activeReservationsCount(): number {
    return this.reservations.filter(res => res.status === 'active').length;
  }

  get userBalance(): number {
    return this.authService.user()?.wallet || 0;
  }
}
