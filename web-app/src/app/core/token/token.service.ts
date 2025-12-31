import { inject, Injectable } from '@angular/core';
import { AuthResponse } from '../models/auth-response';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private router = inject(Router);
  private toastr = inject(ToastrService);

  set token(token: string) {
    localStorage.setItem('token', token);
  }

  get token(): string {
    return localStorage.getItem('token') as string;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.toastr.success('Logout successful!');
  }

  isLoggedIn(): boolean {
    console.log(!this.token);
    if (!this.token) {
      this.toastr.warning(
        'Vous devez être connecté pour acceder à cette page.'
      );
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
