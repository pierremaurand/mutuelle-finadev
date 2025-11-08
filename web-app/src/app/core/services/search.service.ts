import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _search$ = new BehaviorSubject<string>('');
  get search$(): Observable<string> {
    return this._search$.asObservable();
  }

  private _date$ = new BehaviorSubject<string>('');
  get date$(): Observable<string> {
    return this._date$.asObservable();
  }

  constructor() {}

  setSearch(value: string): void {
    this._search$.next(value);
  }

  setDate(value: string): void {
    this._date$.next(value);
  }
}
