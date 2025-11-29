// frontend/src/app/components/reservations/reservations.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservationsComponent } from './reservations';

describe('ReservationsComponent', () => {  // ✅ Cambiar nombre
  let component: ReservationsComponent;    // ✅ Cambiar tipo
  let fixture: ComponentFixture<ReservationsComponent>; // ✅ Cambiar tipo

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsComponent]  // ✅ Cambiar import
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationsComponent); // ✅ Cambiar componente
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
