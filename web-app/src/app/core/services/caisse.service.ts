import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Caisse } from '../models/caisse';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class CaisseService {
  baseUrl: string = environment.baseUrl + '/caisse';

  private _caisses$ = new BehaviorSubject<Caisse[]>([]);
  get caisses$(): Observable<Caisse[]> {
    return this._caisses$.asObservable();
  }

  private _caisse$ = new BehaviorSubject<Caisse>({
    id: 0,
    nom: '',
    agentId: 0,
    dateCaisse: '',
  });
  get caisse$(): Observable<Caisse> {
    return this._caisse$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  getAllCaissesFromServer(): void {
    this.loadingService.setLoadingStatus(true);
    this.http
      .get<Caisse[]>(`${this.baseUrl}`)
      .pipe(
        tap((caisses) => {
          this._caisses$.next(caisses);
          this.loadingService.setLoadingStatus(false);
        })
      )
      .subscribe();
  }

  getCaisseFromServer(id: number): void {
    if (id != 0) {
      this.loadingService.setLoadingStatus(true);
      this.http
        .get<Caisse>(`${this.baseUrl}/${id}`)
        .pipe(
          tap((caisse) => {
            this._caisse$.next(caisse);
            this.loadingService.setLoadingStatus(false);
          })
        )
        .subscribe();
    } else {
      this._caisse$.next({ id: 0, nom: '', agentId: 0, dateCaisse: '' });
    }
  }

  addOrUpdate(id: number, request: Caisse): Observable<any> {
    if (id) {
      console.log(id);
      return this.update(id, request);
    }
    return this.add(request);
  }

  update(id: number, request: Caisse): Observable<any> {
    this.loadingService.setLoadingStatus(true);
    return this.http
      .put<any>(`${this.baseUrl}/${id}`, request)
      .pipe(tap(() => this.loadingService.setLoadingStatus(false)));
  }

  add(request: Caisse): Observable<any> {
    this.loadingService.setLoadingStatus(true);
    return this.http
      .post<any>(`${this.baseUrl}`, request)
      .pipe(tap(() => this.loadingService.setLoadingStatus(false)));
  }
}
