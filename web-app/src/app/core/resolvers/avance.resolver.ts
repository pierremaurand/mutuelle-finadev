import { ResolveFn } from '@angular/router';
import { AvanceService } from '../services/avance.service';
import { inject } from '@angular/core';

export const avanceResolver: ResolveFn<boolean> = (route, state) => {
  const avanceService = inject(AvanceService);
  const id = route.paramMap.get('avanceId');
  if (id) avanceService.getAvanceFromServer(+id);
  return true;
};
export const avancesResolver: ResolveFn<boolean> = (route, state) => {
  const avanceService = inject(AvanceService);
  avanceService.getAllAvancesFromServer();
  return true;
};
