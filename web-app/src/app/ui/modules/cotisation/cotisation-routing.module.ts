import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { membresResolver } from '../../../core/resolvers/membre.resolver';
import {
  cotisationResolver,
  cotisationsResolver,
} from '../../../core/resolvers/cotisation.resolver';
import { agencesResolver } from '../../../core/resolvers/agence.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'liste',
    pathMatch: 'full',
  },
  {
    path: 'liste',
    loadComponent: () =>
      import('../../pages/cotisation/liste/liste.component').then(
        (m) => m.default
      ),
    resolve: [cotisationsResolver],
  },
  {
    path: 'add',
    loadComponent: () =>
      import('../../pages/cotisation/add/add.component').then((m) => m.default),
    resolve: [cotisationsResolver, membresResolver, agencesResolver],
  },
  {
    path: 'view/:id',
    loadComponent: () =>
      import('../../pages/cotisation/view/view.component').then(
        (m) => m.default
      ),
    resolve: [cotisationResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CotisationRoutingModule {}
