import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Echeance } from '../models/echeance';
import { RemboursementRequest } from '../models/remboursement-request';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class EcheanceService {
  baseUrl: string = environment.baseUrl + '/echeance';

  private _echeances$ = new BehaviorSubject<Echeance[]>([]);
  get echeances$(): Observable<Echeance[]> {
    return this._echeances$.asObservable();
  }

  private _echeance$ = new BehaviorSubject<Echeance>(new Echeance());
  get echeance$(): Observable<Echeance> {
    return this._echeance$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  getAllEcheancesFromServer(): void {
    this.loadingService.setLoadingStatus(true);
    this.http
      .get<Echeance[]>(`${this.baseUrl}`)
      .pipe(
        tap((echeances) => {
          this._echeances$.next(echeances);
          this.loadingService.setLoadingStatus(false);
        })
      )
      .subscribe();
  }

  getEcheanceFromServer(id: number): void {
    if (id != 0) {
      this.loadingService.setLoadingStatus(true);
      this.http
        .get<Echeance>(`${this.baseUrl}/${id}`)
        .pipe(
          tap((echeance) => {
            this._echeance$.next(echeance);
            this.loadingService.setLoadingStatus(false);
          })
        )
        .subscribe();
    } else {
      this._echeance$.next(new Echeance());
    }
  }

  paiementEcheances(echeancier: RemboursementRequest[]): Observable<any> {
    this.loadingService.setLoadingStatus(true);
    return this.http
      .put(`${this.baseUrl}`, echeancier)
      .pipe(tap(() => this.loadingService.setLoadingStatus(false)));
  }
}
