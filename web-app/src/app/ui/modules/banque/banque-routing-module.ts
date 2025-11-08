import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  banqueResolver,
  banquesResolver,
} from '../../../core/resolvers/banque.resolver';
import { mouvementsResolver } from '../../../core/resolvers/mouvement.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'liste',
    pathMatch: 'full',
  },
  {
    path: 'liste',
    loadComponent: () =>
      import('../../pages/banque/liste/liste').then((m) => m.default),
    resolve: [banquesResolver],
  },
  {
    path: 'add/:banqueId',
    loadComponent: () =>
      import('../../pages/banque/add/add').then((m) => m.default),
    resolve: [banqueResolver],
  },
  {
    path: 'view/:banqueId',
    loadComponent: () =>
      import('../../pages/banque/view/view').then((m) => m.default),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../pages/banque/infos/infos').then((m) => m.default),
        resolve: [banqueResolver],
      },
    ],
    resolve: [banqueResolver, mouvementsResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BanqueRoutingModule {}
