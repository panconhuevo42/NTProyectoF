//frontend/src/app/app.routes.ts

import { Routes } from '@angular/router';
import { CatalogComponent } from './components/catalog/catalog';
import { LoginComponent } from './components/login/login';
import { ReservationsComponent } from './components/reservations/reservations';
import { WalletComponent } from './components/wallet/wallet';

export const routes: Routes = [
  { path: '', redirectTo: '/catalog', pathMatch: 'full' }, // Ruta por defecto
  { path: 'catalog', component: CatalogComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'wallet', component: WalletComponent },
  { path: '**', redirectTo: '/catalog' } // Ruta comodín (404)
];
