import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CreditRequest } from '../models/credit-request';
import { Credit } from '../models/credit';
import { Membre } from '../models/membre';
import { Echeance } from '../models/echeance';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class CreditService {
  baseUrl: string = environment.baseUrl + '/credit';
  private membres: Membre[] = [];

  private _credits$ = new BehaviorSubject<Credit[]>([]);
  get credits$(): Observable<Credit[]> {
    return this._credits$.asObservable();
  }

  private _credit$ = new BehaviorSubject<Credit>(new Credit());
  get credit$(): Observable<Credit> {
    return this._credit$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  getAllCreditsFromServer(): void {
    this.loadingService.setLoadingStatus(true);
    this.http
      .get<Credit[]>(`${this.baseUrl}`)
      .pipe(
        tap((credits) => {
          this._credits$.next(credits);
          this.loadingService.setLoadingStatus(false);
        })
      )
      .subscribe();
  }

  getCreditFromServer(id: number): void {
    if (id != 0) {
      this.loadingService.setLoadingStatus(true);
      this.http
        .get<Credit>(`${this.baseUrl}/${id}`)
        .pipe(
          tap((credit) => {
            this._credit$.next(credit);
            this.loadingService.setLoadingStatus(false);
          })
        )
        .subscribe();
    } else {
      this._credit$.next(new Credit());
    }
  }

  update(id: number, request: CreditRequest): Observable<any> {
    this.loadingService.setLoadingStatus(true);
    return this.http
      .put<any>(`${this.baseUrl}/${id}`, request)
      .pipe(tap(() => this.loadingService.setLoadingStatus(false)));
  }

  add(credit: CreditRequest, echeancier: Echeance[]): Observable<any> {
    credit.echeances = echeancier;
    this.loadingService.setLoadingStatus(true);
    return this.http
      .post<any>(`${this.baseUrl}`, credit)
      .pipe(tap(() => this.loadingService.setLoadingStatus(false)));
  }

  anticipationPaiement(id: number, echeancier: Echeance[]): Observable<any> {
    this.loadingService.setLoadingStatus(true);
    return this.http
      .put<any>(`${this.baseUrl}/anticipation/${id}`, echeancier)
      .pipe(tap(() => this.loadingService.setLoadingStatus(false)));
  }
}
