
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game';
@Component({
   selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog.component.html',
})
export class CatalogComponent implements OnInit {
  private gameService = inject(GameService);
  juegos: any[] = [];
  nuevoJuego = { titulo: '', precio: 0, descripcion: '' };

  ngOnInit() {
    this.cargarJuegos();
  }

  cargarJuegos() {
    this.gameService.getJuegos().subscribe({
      next: (data: any) => (this.juegos = data),
      error: err => console.error('Error cargando juegos', err)
    });
  }

  crearJuego() {
    this.gameService.createJuego(this.nuevoJuego).subscribe({
      next: () => {
        this.cargarJuegos();
        this.nuevoJuego = { titulo: '', precio: 0, descripcion: '' };
      },
      error: err => console.error('Error creando juego', err)
    });
  }

  eliminarJuego(id: string) {
    this.gameService.deleteJuego(id).subscribe({
      next: () => this.cargarJuegos(),
      error: err => console.error('Error eliminando juego', err)
    });
  }
}
