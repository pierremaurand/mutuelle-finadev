import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AvanceRequest } from '../models/avance-request';
import { Avance } from '../models/avance';
import { Echeance } from '../models/echeance';
import { RemboursementRequest } from '../models/remboursement-request';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class AvanceService {
  baseUrl: string = environment.baseUrl + '/avance';

  private _avances$ = new BehaviorSubject<Avance[]>([]);
  get avances$(): Observable<Avance[]> {
    return this._avances$.asObservable();
  }

  private _avance$ = new BehaviorSubject<Avance>(new Avance());
  get avance$(): Observable<Avance> {
    return this._avance$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  getAllAvancesFromServer(): void {
    this.loadingService.setLoadingStatus(true);
    this.http
      .get<Avance[]>(`${this.baseUrl}`)
      .pipe(
        tap((avances) => {
          this._avances$.next(avances);
          this.loadingService.setLoadingStatus(false);
        })
      )
      .subscribe();
  }

  getAvanceFromServer(id: number): void {
    if (id != 0) {
      this.loadingService.setLoadingStatus(true);
      this.http
        .get<Avance>(`${this.baseUrl}/${id}`)
        .pipe(
          tap((avance) => {
            this._avance$.next(avance);
            this.loadingService.setLoadingStatus(false);
          })
        )
        .subscribe();
    } else {
      this._avance$.next(new Avance());
    }
  }

  update(id: number, request: AvanceRequest): Observable<any> {
    this.loadingService.setLoadingStatus(true);
    return this.http
      .put<any>(`${this.baseUrl}/${id}`, request)
      .pipe(tap(() => this.loadingService.setLoadingStatus(false)));
  }

  add(avance: AvanceRequest, echeancier: Echeance[]): Observable<any> {
    avance.echeances = echeancier;
    this.loadingService.setLoadingStatus(true);
    return this.http
      .post<any>(`${this.baseUrl}`, avance)
      .pipe(tap(() => this.loadingService.setLoadingStatus(false)));
  }

  anticipationPaiement(
    id: number,
    echeancier: RemboursementRequest[]
  ): Observable<any> {
    this.loadingService.setLoadingStatus(true);
    return this.http
      .put<any>(`${this.baseUrl}/anticipation/${id}`, echeancier)
      .pipe(tap(() => this.loadingService.setLoadingStatus(false)));
  }
}
