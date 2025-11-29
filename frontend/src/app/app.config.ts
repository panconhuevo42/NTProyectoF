//frontend/src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 🎯 2. Habilitar HttpClient
    provideHttpClient(),
    
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
    
   
  ]
};
