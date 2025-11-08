import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenService } from '../token/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);

  return tokenService.isLoggedIn();
};
