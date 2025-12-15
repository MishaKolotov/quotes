import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./quotes/quotes.component').then((m) => m.QuotesComponent),
  },
];
