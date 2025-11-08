import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CotisationService } from '../services/cotisation.service';

export const cotisationResolver: ResolveFn<boolean> = (route, state) => {
  const cotisationService = inject(CotisationService);
  const id = route.paramMap.get('cotisationId');
  if (id) cotisationService.getCotisationFromServer(+id);
  return true;
};

export const cotisationsResolver: ResolveFn<boolean> = (route, state) => {
  const cotisationService = inject(CotisationService);
  cotisationService.getAllCotisationsFromServer();
  return true;
};
