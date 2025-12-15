import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { appRoutes } from './app.routes';
import { dbConfig } from '@quotes-app/shared/data-access';
import { NetworkRepository } from '@quotes-app/shared/state';
import { RatingsRepository } from '@quotes-app/quotes/feature';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    importProvidersFrom(NgxIndexedDBModule.forRoot(dbConfig)),
    provideAppInitializer(() => {
      const networkRepo = inject(NetworkRepository);
      const ratingsRepo = inject(RatingsRepository);
      networkRepo.initialize();
      ratingsRepo.loadRatingsFromDB().subscribe();
    }),
  ],
};
