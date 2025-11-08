import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  adhesionResolver,
  adhesionsResolver,
} from '../../../core/resolvers/adhesion.resolver';
import { membresResolver } from '../../../core/resolvers/membre.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'liste',
    pathMatch: 'full',
  },
  {
    path: 'liste',
    loadComponent: () =>
      import('../../pages/adhesion/liste/liste.component').then(
        (m) => m.default
      ),
    resolve: [adhesionsResolver],
  },
  {
    path: 'add',
    loadComponent: () =>
      import('../../pages/adhesion/add/add.component').then((m) => m.default),
    resolve: [adhesionsResolver, membresResolver],
  },
  {
    path: 'view/:id',
    loadComponent: () =>
      import('../../pages/adhesion/view/view.component').then((m) => m.default),
    resolve: [adhesionResolver, membresResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdhesionRoutingModule {}
