// import { NgxPrintElementModule } from 'ngx-print-element';
import {
  ApplicationConfig,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withViewTransitions,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptors,
  withFetch,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { httpTokenInterceptor } from './core/interceptors/http-token.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
// import { NgxPrintElementModule } from 'ngx-print-element';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions(),
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
      })
    ),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    provideHttpClient(withInterceptors([httpTokenInterceptor]), withFetch()),
    provideToastr({ closeButton: true }),
    provideAnimations(),
    DatePipe,
    provideCharts(withDefaultRegisterables()),
  ],
};
