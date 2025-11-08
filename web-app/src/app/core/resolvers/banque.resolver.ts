import { ResolveFn } from '@angular/router';
import { BanqueService } from '../services/banque.service';
import { inject } from '@angular/core';

export const banqueResolver: ResolveFn<boolean> = (route, state) => {
  const banqueService = inject(BanqueService);
  const id = route.paramMap.get('banqueId');
  if (id) banqueService.getBanqueFromServer(+id);
  return true;
};

export const banquesResolver: ResolveFn<boolean> = (route, state) => {
  const banqueService = inject(BanqueService);
  banqueService.getAllBanquesFromServer();
  return true;
};
