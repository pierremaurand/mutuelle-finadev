import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequest } from '../models/auth-request';
import { BehaviorSubject, delay, Observable, Subject, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { environment } from '../../../environments/environment';
import { UserInfos } from '../models/user-infos';
import { ChangePasswordRequest } from '../models/change-password-request';
import { UpdatePhotoRequest } from '../models/update-photo-request';
import { TokenRequest } from '../models/token-request';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  baseUrl: string = environment.baseUrl + '/auth';

  private _userInfos$ = new BehaviorSubject<UserInfos>({});
  get userInfos$(): Observable<UserInfos> {
    return this._userInfos$.asObservable();
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request);
  }

  refreshToken(request: TokenRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/refresh-token`,
      request
    );
  }

  getUserInfosFromServer(): void {
    this.loadingService.setLoadingStatus(true);
    this.http
      .get<UserInfos>(this.baseUrl)
      .pipe(
        tap((infos) => {
          this._userInfos$.next(infos);
          this.loadingService.setLoadingStatus(false);
        })
      )
      .subscribe();
  }

  changePassword(id: number, request: ChangePasswordRequest): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/password/${id}`, request);
  }

  updatePhoto(id: number, request: UpdatePhotoRequest): Observable<UserInfos> {
    return this.http.put<UserInfos>(`${this.baseUrl}/photo/${id}`, request);
  }
}
