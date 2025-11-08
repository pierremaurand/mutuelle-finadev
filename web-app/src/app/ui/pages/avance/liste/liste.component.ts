import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Avance } from '../../../../core/models/avance';
import { combineLatest, map, Observable } from 'rxjs';
import { AvanceService } from '../../../../core/services/avance.service';
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
  avances$!: Observable<Avance[]>;
  search$!: Observable<string>;
  selectedAvance!: Avance;

  constructor(
    private avanceService: AvanceService,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.search$ = this.searchService.search$;
    this.search$.subscribe();

    this.avances$ = combineLatest([
      this.searchService.search$,
      this.avanceService.avances$,
    ]).pipe(
      map(([search, avances]) =>
        avances.filter(
          (avance: Avance) =>
            avance.nom &&
            avance.nom.toLowerCase().includes(search) &&
            avance.montantCapitalRestant &&
            avance.montantCapitalRestant > 0
        )
      )
    );
    this.avances$.subscribe();
  }

  add(): void {
    this.router.navigateByUrl('/avance/add');
  }

  onAvanceSelected(avance: InfosPret): void {
    this.selectedAvance = avance;
  }

  onView(avance: Avance): void {
    this.router.navigateByUrl('/avance/view/' + avance.id + '/infos');
  }
}
