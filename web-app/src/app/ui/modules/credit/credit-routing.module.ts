import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  creditResolver,
  creditsResolver,
} from '../../../core/resolvers/credit.resolver';
import { membresResolver } from '../../../core/resolvers/membre.resolver';
import { agencesResolver } from '../../../core/resolvers/agence.resolver';
import { echeancesResolver } from '../../../core/resolvers/echeance.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'liste',
    pathMatch: 'full',
  },
  {
    path: 'liste',
    loadComponent: () =>
      import('../../pages/credit/liste/liste.component').then((m) => m.default),
    resolve: [creditsResolver],
  },
  {
    path: 'add',
    loadComponent: () =>
      import('../../pages/credit/add/add.component').then((m) => m.default),
    resolve: [membresResolver, agencesResolver],
  },
  {
    path: 'view/:creditId',
    loadComponent: () =>
      import('../../pages/credit/view/view.component').then((m) => m.default),
    children: [
      {
        path: 'infos',
        loadComponent: () => import('../../pages/credit/infos/infos.component'),
        data: {
          origin: 'credit',
        },
        resolve: [creditResolver, echeancesResolver],
      },
      {
        path: 'paiement',
        loadComponent: () =>
          import('../../pages/credit/paiement/paiement.component'),
        resolve: [creditResolver, echeancesResolver],
      },
    ],
    resolve: [creditResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditRoutingModule {}
