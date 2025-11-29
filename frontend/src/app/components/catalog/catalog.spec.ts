// frontend/src/app/components/catalog/catalog.spec.ts



import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogComponent, Game } from './catalog';
import { GameService } from '../../services/game';         
import { AuthService } from '../../services/auth';          
import { ReservationService } from '../../services/reservation';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

// Mocks actualizados para coincidir con servicios reales
const mockGameService = {
  getProximosJuegos: jasmine.createSpy('getProximosJuegos').and.returnValue(of([])) 
};

const mockAuthService = {
  user: jasmine.createSpy('user').and.returnValue(null),
  // Eliminar métodos antiguos: isLoggedIn, getCurrentUser, hasSufficientBalance
};

const mockReservationService = {
  crearReserva: jasmine.createSpy('crearReserva').and.returnValue(of({})) 
};

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;
  let gameService: jasmine.SpyObj<GameService>;
  let authService: jasmine.SpyObj<AuthService>;
  let reservationService: jasmine.SpyObj<ReservationService>;

  const mockGames: Game[] = [
    {
      _id: '1',
      title: 'Test Game 1',
      price: 59.99,
      description: 'Test description 1',
      releaseDate: '2024-12-31',
      developer: 'Test Developer 1',
      genre: 'Action',
      available: true,
      image: 'test1.jpg'
    }
    // ... resto igual
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogComponent],
      providers: [
        { provide: GameService, useValue: mockGameService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ReservationService, useValue: mockReservationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    reservationService = TestBed.inject(ReservationService) as jasmine.SpyObj<ReservationService>;
  });

  // ... tests necesitan actualizarse para usar user() signal
});