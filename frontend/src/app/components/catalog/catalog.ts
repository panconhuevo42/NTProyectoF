import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { AuthService } from '../../../services/auth.service';
import { ReservationService } from '../../../services/reservation.service';

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

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
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
    this.gameService.getUpcomingGames().subscribe({
      next: (games) => {
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
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para realizar una reserva');
      return;
    }

    if (!this.authService.hasSufficientBalance(game.price)) {
      alert('Saldo insuficiente. Por favor, recarga tu wallet.');
      return;
    }

    if (confirm(`¿Reservar "${game.title}" por $${game.price}?`)) {
      this.reservationService.createReservation(game._id).subscribe({
        next: (response) => {
          alert('¡Reserva realizada con éxito!');
          this.loadGames(); // Recargar para actualizar saldo
        },
        error: (error) => {
          alert('Error al realizar la reserva: ' + error.error.message);
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
    return this.authService.getCurrentUser()?.wallet || 0;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}