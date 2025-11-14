import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogComponent, Game } from './catalog.component';
import { GameService } from '../../../services/game.service';
import { AuthService } from '../../../services/auth.service';
import { ReservationService } from '../../../services/reservation.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

// Mocks para los servicios
const mockGameService = {
  getUpcomingGames: jasmine.createSpy('getUpcomingGames').and.returnValue(of([]))
};

const mockAuthService = {
  isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(false),
  getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(null),
  hasSufficientBalance: jasmine.createSpy('hasSufficientBalance').and.returnValue(false)
};

const mockReservationService = {
  createReservation: jasmine.createSpy('createReservation').and.returnValue(of({}))
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
    },
    {
      _id: '2',
      title: 'Test Game 2',
      price: 39.99,
      description: 'Test description 2',
      releaseDate: '2024-11-15',
      developer: 'Test Developer 2',
      genre: 'RPG',
      available: true,
      image: 'test2.jpg'
    }
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load games on init', () => {
      gameService.getUpcomingGames.and.returnValue(of(mockGames));
      
      fixture.detectChanges(); // Triggers ngOnInit

      expect(gameService.getUpcomingGames).toHaveBeenCalled();
      expect(component.games).toEqual(mockGames);
      expect(component.filteredGames).toEqual(mockGames);
      expect(component.loading).toBeFalse();
    });

    it('should handle error when loading games fails', () => {
      const errorMessage = 'Error loading games';
      gameService.getUpcomingGames.and.returnValue(throwError(() => ({ error: { message: errorMessage } })));
      
      fixture.detectChanges();

      expect(component.error).toBe('Error al cargar los juegos');
      expect(component.loading).toBeFalse();
    });
  });

  describe('Game Filtering', () => {
    beforeEach(() => {
      component.games = mockGames;
      component.filteredGames = mockGames;
    });

    it('should filter games by search term', () => {
      component.searchTerm = 'Test Game 1';
      component.filterGames();

      expect(component.filteredGames.length).toBe(1);
      expect(component.filteredGames[0].title).toBe('Test Game 1');
    });

    it('should filter games by genre', () => {
      component.selectedGenre = 'Action';
      component.filterGames();

      expect(component.filteredGames.length).toBe(1);
      expect(component.filteredGames[0].genre).toBe('Action');
    });

    it('should show all games when genre is "all"', () => {
      component.selectedGenre = 'all';
      component.filterGames();

      expect(component.filteredGames.length).toBe(2);
    });

    it('should combine search and genre filters', () => {
      component.searchTerm = 'Test';
      component.selectedGenre = 'RPG';
      component.filterGames();

      expect(component.filteredGames.length).toBe(1);
      expect(component.filteredGames[0].title).toBe('Test Game 2');
      expect(component.filteredGames[0].genre).toBe('RPG');
    });
  });

  describe('Game Availability', () => {
    it('should return true for available future games', () => {
      const futureGame: Game = {
        _id: '3',
        title: 'Future Game',
        price: 49.99,
        description: 'Future game description',
        releaseDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        developer: 'Test Dev',
        genre: 'Action',
        available: true
      };

      expect(component.isGameAvailable(futureGame)).toBeTrue();
    });

    it('should return false for past release dates', () => {
      const pastGame: Game = {
        _id: '4',
        title: 'Past Game',
        price: 49.99,
        description: 'Past game description',
        releaseDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        developer: 'Test Dev',
        genre: 'Action',
        available: true
      };

      expect(component.isGameAvailable(pastGame)).toBeFalse();
    });

    it('should return false for unavailable games', () => {
      const unavailableGame: Game = {
        _id: '5',
        title: 'Unavailable Game',
        price: 49.99,
        description: 'Unavailable game description',
        releaseDate: new Date(Date.now() + 86400000).toISOString(),
        developer: 'Test Dev',
        genre: 'Action',
        available: false
      };

      expect(component.isGameAvailable(unavailableGame)).toBeFalse();
    });
  });

  describe('Days Until Release Calculation', () => {
    it('should calculate correct days until release', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      
      const game: Game = {
        _id: '6',
        title: 'Future Game',
        price: 49.99,
        description: 'Test',
        releaseDate: futureDate.toISOString(),
        developer: 'Test',
        genre: 'Action',
        available: true
      };

      expect(component.getDaysUntilRelease(game.releaseDate)).toBe(10);
    });

    it('should return 0 for today release', () => {
      const today = new Date().toISOString();
      const game: Game = {
        _id: '7',
        title: 'Today Game',
        price: 49.99,
        description: 'Test',
        releaseDate: today,
        developer: 'Test',
        genre: 'Action',
        available: true
      };

      // Puede ser 0 o 1 dependiendo de la hora, pero debe ser un número
      expect(component.getDaysUntilRelease(game.releaseDate)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Reservation Functionality', () => {
    it('should show login alert when user is not logged in', () => {
      authService.isLoggedIn.and.returnValue(false);
      spyOn(window, 'alert');
      
      component.reserveGame(mockGames[0]);

      expect(window.alert).toHaveBeenCalledWith('Debes iniciar sesión para realizar una reserva');
      expect(reservationService.createReservation).not.toHaveBeenCalled();
    });

    it('should show insufficient balance alert', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.hasSufficientBalance.and.returnValue(false);
      spyOn(window, 'alert');
      
      component.reserveGame(mockGames[0]);

      expect(window.alert).toHaveBeenCalledWith('Saldo insuficiente. Por favor, recarga tu wallet.');
      expect(reservationService.createReservation).not.toHaveBeenCalled();
    });

    it('should create reservation when conditions are met', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.hasSufficientBalance.and.returnValue(true);
      reservationService.createReservation.and.returnValue(of({ success: true }));
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(component, 'loadGames');
      spyOn(window, 'alert');
      
      component.reserveGame(mockGames[0]);

      expect(reservationService.createReservation).toHaveBeenCalledWith('1');
      expect(window.alert).toHaveBeenCalledWith('¡Reserva realizada con éxito!');
      expect(component.loadGames).toHaveBeenCalled();
    });

    it('should handle reservation error', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.hasSufficientBalance.and.returnValue(true);
      const errorResponse = { error: { message: 'Reservation failed' } };
      reservationService.createReservation.and.returnValue(throwError(() => errorResponse));
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(window, 'alert');
      
      component.reserveGame(mockGames[0]);

      expect(window.alert).toHaveBeenCalledWith('Error al realizar la reserva: Reservation failed');
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      gameService.getUpcomingGames.and.returnValue(of(mockGames));
      fixture.detectChanges();
    });

    it('should display game cards', () => {
      const gameCards = fixture.debugElement.queryAll(By.css('.game-card'));
      expect(gameCards.length).toBe(2);
    });

    it('should display game information correctly', () => {
      const firstGameTitle = fixture.debugElement.query(By.css('.game-title')).nativeElement;
      expect(firstGameTitle.textContent).toContain('Test Game 1');
    });

    it('should show loading state', () => {
      component.loading = true;
      fixture.detectChanges();

      const loadingElement = fixture.debugElement.query(By.css('.loading'));
      expect(loadingElement).toBeTruthy();
    });

    it('should show error state', () => {
      component.error = 'Test error message';
      component.loading = false;
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('.error'));
      expect(errorElement.nativeElement.textContent).toContain('Test error message');
    });

    it('should show empty state when no games', () => {
      component.filteredGames = [];
      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(By.css('.empty-state'));
      expect(emptyState).toBeTruthy();
    });
  });

  describe('User Balance Display', () => {
    it('should return user balance when logged in', () => {
      const mockUser = { wallet: 100, _id: '1', username: 'test', email: 'test@test.com' };
      authService.getCurrentUser.and.returnValue(mockUser);
      
      expect(component.userBalance).toBe(100);
    });

    it('should return 0 when user is not logged in', () => {
      authService.getCurrentUser.and.returnValue(null);
      
      expect(component.userBalance).toBe(0);
    });
  });
});
