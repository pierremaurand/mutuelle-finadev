import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Adhesion } from '../../../../core/models/adhesion';
import { combineLatest, map, Observable } from 'rxjs';
import { AdhesionService } from '../../../../core/services/adhesion.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../../core/services/search.service';
import { MembreCardComponent } from '../../membre/membre-card/membre-card.component';
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
  adhesions$!: Observable<Adhesion[]>;
  search$!: Observable<string>;
  selectedAdhesion!: Adhesion;

  constructor(
    private adhesionService: AdhesionService,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.search$ = this.searchService.search$;
    this.search$.subscribe();

    this.adhesions$ = combineLatest([
      this.searchService.search$,
      this.adhesionService.adhesions$,
    ]).pipe(
      map(([search, adhesions]) =>
        adhesions.filter(
          (adhesion: Adhesion) =>
            adhesion.nom && adhesion.nom.toLowerCase().includes(search)
        )
      )
    );
    this.adhesions$.subscribe();
  }

  add(): void {
    this.router.navigateByUrl('/adhesion/add');
  }

  onAdhesionSelected(adhesion: Adhesion): void {
    this.selectedAdhesion = adhesion;
  }

  onView(adhesion: Adhesion): void {
    this.router.navigateByUrl('/adhesion/view/' + adhesion.id);
  }
}
