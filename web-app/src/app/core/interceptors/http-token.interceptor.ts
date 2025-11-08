import { LoadingService } from './../services/loading.service';
import { TokenService } from './../token/token.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenRequest } from '../models/token-request';
import { LoadImageService } from 'ngx-image-cropper';

export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  const token = tokenService.token;
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService
          .refreshToken(tokenService.tokenData as TokenRequest)
          .subscribe({
            next: (response) => {
              tokenService.token = response.token as string;
              tokenService.refreshToken = response.refreshToken as string;
              tokenService.tokenData = response;
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.token}`,
                },
              });
              next(clonedReq);
            },
            error: () => {
              tokenService.logout();
            },
          });
      }
      return throwError(() => error);
    })
  );
};
