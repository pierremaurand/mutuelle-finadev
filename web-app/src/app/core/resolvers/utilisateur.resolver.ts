import { ResolveFn } from '@angular/router';
import { UtilisateurService } from '../services/utilisateur.service';
import { inject } from '@angular/core';

export const utilisateurResolver: ResolveFn<boolean> = (route, state) => {
  const utilisateurService = inject(UtilisateurService);
  const id = route.paramMap.get('utilisateurId');
  if (id) utilisateurService.getUtilisateurFromServer(+id);
  return true;
};

export const utilisateursResolver: ResolveFn<boolean> = (route, state) => {
  const utilisateurService = inject(UtilisateurService);
  utilisateurService.getAllUtilisateursFromServer();
  return true;
};
