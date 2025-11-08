import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  membreResolver,
  membresResolver,
} from '../../../core/resolvers/membre.resolver';
import { agencesResolver } from '../../../core/resolvers/agence.resolver';
import { cotisationsResolver } from '../../../core/resolvers/cotisation.resolver';
import {
  creditResolver,
  creditsResolver,
} from '../../../core/resolvers/credit.resolver';
import {
  avanceResolver,
  avancesResolver,
} from '../../../core/resolvers/avance.resolver';
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
      import('../../pages/membre/liste/liste.component').then((m) => m.default),
    resolve: [membresResolver, agencesResolver],
  },
  {
    path: 'add/:membreId',
    loadComponent: () =>
      import('../../pages/membre/add/add.component').then((m) => m.default),
    resolve: [membreResolver, agencesResolver],
  },
  {
    path: 'view/:membreId',
    loadComponent: () =>
      import('../../pages/membre/view/view.component').then((m) => m.default),
    children: [
      {
        path: 'infos',
        loadComponent: () =>
          import('../../pages/membre/membre-infos/membre-infos.component'),
        resolve: [
          membreResolver,
          cotisationsResolver,
          avancesResolver,
          creditsResolver,
        ],
      },
      {
        path: 'image',
        loadComponent: () =>
          import('../../composants/image-add/image-add.component'),
        resolve: [membreResolver],
        data: {
          origin: 'membre',
        },
      },
      {
        path: 'credit/:creditId',
        loadComponent: () => import('../../pages/credit/infos/infos.component'),
        data: {
          origin: 'membre',
        },
        resolve: [creditResolver, echeancesResolver],
      },
      {
        path: 'avance/:avanceId',
        loadComponent: () => import('../../pages/avance/infos/infos.component'),
        data: {
          origin: 'membre',
        },
        resolve: [avanceResolver, echeancesResolver],
      },
    ],
    resolve: [membreResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembreRoutingModule {}
