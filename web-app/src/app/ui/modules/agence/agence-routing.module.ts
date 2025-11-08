import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  agenceResolver,
  agencesResolver,
} from '../../../core/resolvers/agence.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'liste',
    pathMatch: 'full',
  },
  {
    path: 'liste',
    loadComponent: () =>
      import('../../pages/agence/liste/liste.component').then((m) => m.default),
    resolve: [agencesResolver],
  },
  {
    path: 'add/:id',
    loadComponent: () =>
      import('../../pages/agence/add/add.component').then((m) => m.default),
    resolve: [agenceResolver],
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('../../pages/agence/add/add.component').then((m) => m.default),
    resolve: [agenceResolver],
  },
  {
    path: 'view/:id',
    loadComponent: () =>
      import('../../pages/agence/view/view.component').then((m) => m.default),
    resolve: [agenceResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgenceRoutingModule {}
