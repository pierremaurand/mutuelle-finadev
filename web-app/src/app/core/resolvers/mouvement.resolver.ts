import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MouvementService } from '../services/mouvement.service';

export const mouvementResolver: ResolveFn<boolean> = (route, state) => {
  const mouvementService = inject(MouvementService);
  const id = route.paramMap.get('mouvementId');
  if (id) mouvementService.getMouvementFromServer(+id);
  return true;
};

export const mouvementsResolver: ResolveFn<boolean> = (route, state) => {
  const mouvementService = inject(MouvementService);
  mouvementService.getAllMouvementsFromServer();
  return true;
};
