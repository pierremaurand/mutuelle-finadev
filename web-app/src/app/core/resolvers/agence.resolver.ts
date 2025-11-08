import { ResolveFn } from '@angular/router';
import { AgenceService } from '../services/agence.service';
import { inject } from '@angular/core';

export const agenceResolver: ResolveFn<boolean> = (route, state) => {
  const agenceService = inject(AgenceService);
  const id = route.paramMap.get('agenceIdd');
  if (id) agenceService.getAgenceFromServer(+id);
  return true;
};

export const agencesResolver: ResolveFn<boolean> = (route, state) => {
  const agenceService = inject(AgenceService);
  agenceService.getAllAgencesFromServer();
  return true;
};
