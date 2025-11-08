import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MembreService } from '../services/membre.service';

export const membreResolver: ResolveFn<boolean> = (route, state) => {
  const membreService = inject(MembreService);
  const id = route.paramMap.get('membreId');
  if (id) membreService.getMembreFromServer(+id);
  return true;
};

export const membresResolver: ResolveFn<boolean> = (route, state) => {
  const membreService = inject(MembreService);
  membreService.getAllMembresFromServer();
  return true;
};
