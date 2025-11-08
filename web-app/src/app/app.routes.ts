import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/layout/layout.component'),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./ui/modules/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'utilisateur',
        loadChildren: () =>
          import('./ui/modules/utilisateur/utilisateur.module').then(
            (m) => m.UtilisateurModule
          ),
      },
      {
        path: 'agence',
        loadChildren: () =>
          import('./ui/modules/agence/agence.module').then(
            (m) => m.AgenceModule
          ),
      },
      {
        path: 'membre',
        loadChildren: () =>
          import('./ui/modules/membre/membre.module').then(
            (m) => m.MembreModule
          ),
      },
      {
        path: 'adhesion',
        loadChildren: () =>
          import('./ui/modules/adhesion/adhesion.module').then(
            (m) => m.AdhesionModule
          ),
      },
      {
        path: 'cotisation',
        loadChildren: () =>
          import('./ui/modules/cotisation/cotisation.module').then(
            (m) => m.CotisationModule
          ),
      },
      {
        path: 'avance',
        loadChildren: () =>
          import('./ui/modules/avance/avance.module').then(
            (m) => m.AvanceModule
          ),
      },
      {
        path: 'credit',
        loadChildren: () =>
          import('./ui/modules/credit/credit.module').then(
            (m) => m.CreditModule
          ),
      },
      {
        path: 'caisse',
        loadChildren: () =>
          import('./ui/modules/caisse/caisse.module').then(
            (m) => m.CaisseModule
          ),
      },
      {
        path: 'banque',
        loadChildren: () =>
          import('./ui/modules/banque/banque-module').then(
            (m) => m.BanqueModule
          ),
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./ui/modules/auth/auth.module').then((m) => m.AuthModule),
  },
  // {
  //   path: 'print/:id',
  //   loadComponent: () =>
  //     import('./ui/pages/print-mouvement/print-mouvement').then(
  //       (m) => m.default
  //     ),
  // },
];
