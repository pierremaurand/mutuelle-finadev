import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Agence } from '../models/agence';
import { AgenceRequest } from '../models/agence-request';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class AgenceService {
  baseUrl: string = environment.baseUrl + '/agence';

  private _agences$ = new BehaviorSubject<Agence[]>([]);
  get agences$(): Observable<Agence[]> {
    return this._agences$.asObservable();
  }

  private _agence$ = new BehaviorSubject<Agence>(new Agence());
  get agence$(): Observable<Agence> {
    return this._agence$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  getAllAgencesFromServer(): void {
    this.loadingService.setLoadingStatus(true);
    this.http
      .get<Agence[]>(`${this.baseUrl}`)
      .pipe(
        tap((agences) => {
          this._agences$.next(agences);
          this.loadingService.setLoadingStatus(false);
        })
      )
      .subscribe();
  }

  getAgenceFromServer(id: number): void {
    if (id != 0) {
      this.loadingService.setLoadingStatus(true);
      this.http
        .get<Agence>(`${this.baseUrl}/${id}`)
        .pipe(
          tap((agence) => {
            this._agence$.next(agence);
            this.loadingService.setLoadingStatus(false);
          })
        )
        .subscribe();
    } else {
      this._agence$.next(new Agence());
    }
  }

  addOrUpdate(id: number, request: AgenceRequest): Observable<any> {
    if (id != 0) {
      return this.update(id, request);
    }
    return this.add(request);
  }

  update(id: number, request: AgenceRequest): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/${id}`, request)
      .pipe(tap(() => this.loadingService.setLoadingStatus(false)));
  }

  add(request: AgenceRequest): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}`, request)
      .pipe(tap(() => this.loadingService.setLoadingStatus(false)));
  }
}
