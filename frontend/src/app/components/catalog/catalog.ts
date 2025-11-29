// frontend/src/app/components/catalog/catalog.ts


// frontend/src/app/components/catalog/catalog.ts
import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { GameService } from '../../services/game';
import { AuthService } from '../../services/auth';
import { ReservationService } from '../../services/reservation';

export interface Game {
  _id: string;
  title: string;
  price: number;
  description: string;
  releaseDate: string;
  developer: string;
  genre: string;
  available: boolean;
  image?: string;
}

// ✅ AGREGAR @Component DECORATOR
@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.css']
})
export class CatalogComponent implements OnInit { // ✅ CORREGIR nombre de clase
  games: Game[] = [];
  filteredGames: Game[] = [];
  loading: boolean = true;
  error: string = '';
  searchTerm: string = '';
  selectedGenre: string = 'all';
  genres: string[] = ['all', 'Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Simulation'];

  constructor(
    private gameService: GameService,
    private authService: AuthService,  
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.loading = true;
    this.gameService.getProximosJuegos().subscribe({
      next: (games: any) => {
        this.games = games;
        this.filteredGames = games;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los juegos';
        this.loading = false;
        console.error('Error loading games:', error);
      }
    });
  }

  filterGames(): void {
    this.filteredGames = this.games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           game.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesGenre = this.selectedGenre === 'all' || game.genre === this.selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }

  onSearchChange(): void {
    this.filterGames();
  }

  onGenreChange(genre: string): void {
    this.selectedGenre = genre;
    this.filterGames();
  }

  reserveGame(game: Game): void {
    const currentUser = this.authService.user();
    if (!currentUser) {
      alert('Debes iniciar sesión para realizar una reserva');
      return;
    }

    if (currentUser.wallet < game.price) {
      alert('Saldo insuficiente. Por favor, recarga tu wallet.');
      return;
    }

    if (confirm(`¿Reservar "${game.title}" por $${game.price}?`)) {
      this.reservationService.crearReserva({
        userId: currentUser.id,
        gameId: game._id
      }).subscribe({
        next: (response: any) => {
          alert('¡Reserva realizada con éxito!');
          // Actualizar usuario local con nuevo saldo
          if (response.reservation && response.reservation.userId) {
            this.authService.user.set(response.reservation.userId);
          }
          this.loadGames();
        },
        error: (error) => {
          alert('Error al realizar la reserva: ' + (error.error?.message || 'Error desconocido'));
        }
      });
    }
  }

  isGameAvailable(game: Game): boolean {
    return game.available && new Date(game.releaseDate) > new Date();
  }

  getDaysUntilRelease(releaseDate: string): number {
    const release = new Date(releaseDate);
    const today = new Date();
    const diffTime = release.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get userBalance(): number {
    return this.authService.user()?.wallet || 0;
  }

  get isLoggedIn(): boolean {
    return this.authService.user() !== null;
  }
}