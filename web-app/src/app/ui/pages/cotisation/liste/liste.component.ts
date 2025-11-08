import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Cotisation } from '../../../../core/models/cotisation';
import { combineLatest, map, Observable } from 'rxjs';
import { CotisationService } from '../../../../core/services/cotisation.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../../core/services/search.service';
import { MembreCardComponent } from '../../membre/membre-card/membre-card.component';
import { Ligne } from '../ligne/ligne';
import { InfosPret } from '../../../../core/models/infos-pret';
import { SortPipe } from '../../../../core/pipes/sort.pipe';

@Component({
  selector: 'app-liste',
  imports: [CommonModule, MembreCardComponent, Ligne, SortPipe],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListeComponent implements OnInit {
  cotisations$!: Observable<Cotisation[]>;
  search$!: Observable<string>;
  selectedCotisation!: Cotisation;

  constructor(
    private cotisationService: CotisationService,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.search$ = this.searchService.search$;
    this.search$.subscribe();

    this.cotisations$ = combineLatest([
      this.searchService.search$,
      this.cotisationService.cotisations$,
    ]).pipe(
      map(([search, cotisations]) =>
        cotisations.filter(
          (cotisation: Cotisation) =>
            cotisation.nom && cotisation.nom.toLowerCase().includes(search)
        )
      )
    );
    this.cotisations$.subscribe();
  }

  add(): void {
    this.router.navigateByUrl('/cotisation/add');
  }

  onCotisationSelected(cotisation: InfosPret): void {
    this.selectedCotisation = cotisation;
  }

  onView(cotisation: Cotisation): void {
    this.router.navigateByUrl('/cotisation/view/' + cotisation.id);
  }
}
