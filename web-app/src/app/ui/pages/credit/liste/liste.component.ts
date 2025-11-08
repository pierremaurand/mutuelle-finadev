import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Credit } from '../../../../core/models/credit';
import { combineLatest, map, Observable } from 'rxjs';
import { CreditService } from '../../../../core/services/credit.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../../core/services/search.service';
import { MembreCardComponent } from '../../membre/membre-card/membre-card.component';
import { InfosPret } from '../../../../core/models/infos-pret';
import { Ligne } from '../ligne/ligne';
import { SortPipe } from '../../../../core/pipes/sort.pipe';

@Component({
  selector: 'app-liste',
  imports: [CommonModule, MembreCardComponent, Ligne, SortPipe],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListeComponent implements OnInit {
  credits$!: Observable<Credit[]>;
  search$!: Observable<string>;
  selectedCredit!: Credit;

  constructor(
    private creditService: CreditService,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.search$ = this.searchService.search$;
    this.search$.subscribe();

    this.credits$ = combineLatest([
      this.searchService.search$,
      this.creditService.credits$,
    ]).pipe(
      map(([search, credits]) =>
        credits.filter(
          (credit: Credit) =>
            credit.nom &&
            credit.nom.toLowerCase().includes(search) &&
            credit.montantCapitalRestant &&
            credit.montantCapitalRestant > 0
        )
      )
    );
    this.credits$.subscribe();
  }

  add(): void {
    this.router.navigateByUrl('/credit/add');
  }

  onCreditSelected(credit: InfosPret): void {
    this.selectedCredit = credit;
  }

  onView(credit: Credit): void {
    this.router.navigateByUrl('/credit/view/' + credit.id + '/infos');
  }
}
