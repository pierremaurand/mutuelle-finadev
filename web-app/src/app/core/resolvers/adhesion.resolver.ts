import { ResolveFn } from '@angular/router';
import { AdhesionService } from '../services/adhesion.service';
import { inject } from '@angular/core';

export const adhesionResolver: ResolveFn<boolean> = (route, state) => {
  const adhesionService = inject(AdhesionService);
  const id = route.paramMap.get('adhesionId');
  if (id) adhesionService.getAdhesionFromServer(+id);
  return true;
};
export const adhesionsResolver: ResolveFn<boolean> = (route, state) => {
  const adhesionService = inject(AdhesionService);
  adhesionService.getAllAdhesionsFromServer();
  return true;
};
