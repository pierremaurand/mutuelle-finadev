import { ResolveFn } from '@angular/router';
import { CaisseService } from '../services/caisse.service';
import { inject } from '@angular/core';

export const caisseResolver: ResolveFn<boolean> = (route, state) => {
  const caisseService = inject(CaisseService);
  const id = route.paramMap.get('caisseId');
  if (id) caisseService.getCaisseFromServer(+id);
  return true;
};

export const caissesResolver: ResolveFn<boolean> = (route, state) => {
  const caisseService = inject(CaisseService);
  caisseService.getAllCaissesFromServer();
  return true;
};
