import { Routes } from '@angular/router';
import { guardAutenticacao, redirecionarSeAutenticado } from '@core/guards/autenticacao.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [redirecionarSeAutenticado],
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [guardAutenticacao],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
