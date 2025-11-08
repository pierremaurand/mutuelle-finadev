import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CotisationRequest } from '../models/cotisation-request';
import { Cotisation } from '../models/cotisation';
import { Membre } from '../models/membre';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class CotisationService {
  baseUrl: string = environment.baseUrl + '/cotisation';
  private membres: Membre[] = [];

  private _cotisations$ = new BehaviorSubject<Cotisation[]>([]);
  get cotisations$(): Observable<Cotisation[]> {
    return this._cotisations$.asObservable();
  }

  private _cotisation$ = new BehaviorSubject<Cotisation>(new Cotisation());
  get cotisation$(): Observable<Cotisation> {
    return this._cotisation$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  getAllCotisationsFromServer(): void {
    this.loadingService.setLoadingStatus(true);
    this.http
      .get<Cotisation[]>(`${this.baseUrl}`)
      .pipe(
        tap((cotisations) => {
          this._cotisations$.next(cotisations);
          this.loadingService.setLoadingStatus(false);
        })
      )
      .subscribe();
  }

  getCotisationFromServer(id: number): void {
    if (id != 0) {
      this.loadingService.setLoadingStatus(true);
      this.http
        .get<Cotisation>(`${this.baseUrl}/${id}`)
        .pipe(
          tap((cotisation) => {
            this._cotisation$.next(cotisation);
            this.loadingService.setLoadingStatus(false);
          })
        )
        .subscribe();
    } else {
      this._cotisation$.next(new Cotisation());
    }
  }

  update(id: number, request: CotisationRequest): Observable<any> {
    this.loadingService.setLoadingStatus(true);
    return this.http
      .put<any>(`${this.baseUrl}/${id}`, request)
      .pipe(tap(() => this.loadingService.setLoadingStatus(false)));
  }

  add(request: CotisationRequest[]): Observable<any> {
    this.loadingService.setLoadingStatus(true);
    return this.http
      .post<any>(`${this.baseUrl}`, request)
      .pipe(tap(() => this.loadingService.setLoadingStatus(false)));
  }

  setMembres(membres: Membre[]): void {
    this.membres = membres;
  }

  getMembreById(id: number): Membre {
    const membre = this.membres.find((m) => m.id === id);
    return membre ? membre : new Membre();
  }
}
