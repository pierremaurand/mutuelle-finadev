import { caisseResolver } from './../../../core/resolvers/caisse.resolver';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { caissesResolver } from '../../../core/resolvers/caisse.resolver';
import { utilisateursResolver } from '../../../core/resolvers/utilisateur.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'liste',
    pathMatch: 'full',
  },
  {
    path: 'liste',
    loadComponent: () =>
      import('../../pages/caisse/liste-caisse/liste-caisse').then(
        (m) => m.default
      ),
    resolve: [caissesResolver],
  },
  {
    path: 'add/:id',
    loadComponent: () =>
      import('../../pages/caisse/add-caisse/add-caisse').then((m) => m.default),
    resolve: [caisseResolver, caissesResolver, utilisateursResolver],
  },
  {
    path: 'view/:id',
    loadComponent: () =>
      import('../../pages/caisse/view-caisse/view-caisse').then(
        (m) => m.default
      ),
    children: [
      {
        path: '',
        redirectTo: 'accueil',
        pathMatch: 'full',
      },
      {
        path: 'accueil',
        loadComponent: () =>
          import('../../pages/caisse/accueil-caisse/accueil-caisse').then(
            (m) => m.default
          ),
      },
      {
        path: 'alimentation',
        loadComponent: () =>
          import(
            '../../pages/caisse/alimentation-caisse/alimentation-caisse'
          ).then((m) => m.default),
      },
      {
        path: 'remontee',
        loadComponent: () =>
          import('../../pages/caisse/remonte-caisse/remonte-caisse').then(
            (m) => m.default
          ),
      },
      {
        path: 'adhesion',
        loadComponent: () =>
          import('../../pages/caisse/adhesion-caisse/adhesion-caisse').then(
            (m) => m.default
          ),
      },
      {
        path: 'cotisation',
        loadComponent: () =>
          import('../../pages/caisse/cotisation-caisse/cotisation-caisse').then(
            (m) => m.default
          ),
      },
      {
        path: 'avance',
        loadComponent: () =>
          import(
            '../../pages/caisse/decaissement-avance/decaissement-avance'
          ).then((m) => m.default),
      },
      {
        path: 'credit',
        loadComponent: () =>
          import(
            '../../pages/caisse/decaissement-credit/decaissement-credit'
          ).then((m) => m.default),
      },
      {
        path: 'echeance',
        loadComponent: () =>
          import('../../pages/caisse/echeance-caisse/echeance-caisse').then(
            (m) => m.default
          ),
      },
      {
        path: 'entree',
        loadComponent: () =>
          import('../../pages/caisse/entree-caisse/entree-caisse').then(
            (m) => m.default
          ),
      },
      {
        path: 'sortie',
        loadComponent: () =>
          import('../../pages/caisse/sortie-caisse/sortie-caisse').then(
            (m) => m.default
          ),
      },
    ],
  },
  // {
  //   path: 'view',
  //   loadComponent: () =>
  //     import('../../pages/caisse/view/view').then((m) => m.default),
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: 'liste',
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: 'liste',
  //       loadComponent: () =>
  //         import('../../pages/caisse/liste/liste').then((m) => m.default),
  //       resolve: [mouvementsResolver],
  //     },

  //     {
  //       path: 'paiement',
  //       loadComponent: () =>
  //         import('../../pages/caisse/paiement/paiement').then((m) => m.default),
  //       resolve: [echeancesResolver],
  //     },
  //     {
  //       path: 'add',
  //       loadComponent: () =>
  //         import('../../pages/caisse/add/add').then((m) => m.default),
  //     },
  //   ],
  //   resolve: [mouvementsResolver],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaisseRoutingModule {}
