import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { membresResolver } from '../../../core/resolvers/membre.resolver';
import { mouvementsResolver } from '../../../core/resolvers/mouvement.resolver';
import { utilisateurResolver } from '../../../core/resolvers/utilisateur.resolver';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../pages/home/home/home.component'),
    resolve: [membresResolver, mouvementsResolver],
  },
  {
    path: 'profile',
    loadComponent: () => import('../../pages/home/profile/profile.component'),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../pages/home/infos/infos').then((m) => m.default),
      },
      {
        path: 'image',
        loadComponent: () =>
          import('../../composants/image-add/image-add.component'),
        data: {
          origin: 'utilisateur',
        },
      },
      {
        path: 'password',
        loadComponent: () =>
          import('../../pages/home/change-password/change-password.component'),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
