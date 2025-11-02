import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

// 1. Solo se importa provideHttpClient
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 🎯 2. Habilitar HttpClient
    provideHttpClient(), // 👈 COMA AÑADIDA AQUÍ
    
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
    
    // NOTA: Se eliminó 'provideBrowserGlobalErrorListeners' de las importaciones y providers
    // para simplificar, ya que no es un provider estándar necesario para la funcionalidad.
  ]
};
