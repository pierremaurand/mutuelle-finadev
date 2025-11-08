import { ResolveFn } from '@angular/router';
import { CreditService } from '../services/credit.service';
import { inject } from '@angular/core';

export const creditResolver: ResolveFn<boolean> = (route, state) => {
  const creditService = inject(CreditService);
  const id = route.paramMap.get('creditId');
  if (id) creditService.getCreditFromServer(+id);
  return true;
};
export const creditsResolver: ResolveFn<boolean> = (route, state) => {
  const creditService = inject(CreditService);
  creditService.getAllCreditsFromServer();
  return true;
};
