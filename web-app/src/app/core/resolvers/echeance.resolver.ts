import { ResolveFn } from '@angular/router';
import { EcheanceService } from '../services/echeance.service';
import { inject } from '@angular/core';

export const echeanceResolver: ResolveFn<boolean> = (route, state) => {
  const echeanceService = inject(EcheanceService);
  const id = route.paramMap.get('echeanceId');
  if (id) echeanceService.getEcheanceFromServer(+id);
  return true;
};
export const echeancesResolver: ResolveFn<boolean> = (route, state) => {
  const echeanceService = inject(EcheanceService);
  echeanceService.getAllEcheancesFromServer();
  return true;
};
