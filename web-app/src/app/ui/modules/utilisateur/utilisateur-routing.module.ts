import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  utilisateurResolver,
  utilisateursResolver,
} from '../../../core/resolvers/utilisateur.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'liste',
    pathMatch: 'full',
  },
  {
    path: 'liste',
    loadComponent: () =>
      import('../../pages/utilisateur/liste/liste.component').then(
        (m) => m.default
      ),
    resolve: [utilisateursResolver],
  },
  {
    path: 'add/:id',
    loadComponent: () =>
      import('../../pages/utilisateur/add/add.component').then(
        (m) => m.default
      ),
    resolve: [utilisateurResolver],
  },
  {
    path: 'view/:id',
    loadComponent: () =>
      import('../../pages/utilisateur/view/view.component').then(
        (m) => m.default
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilisateurRoutingModule {}
