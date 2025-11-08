import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MouvementService } from '../../../../core/services/mouvement.service';
import { combineLatest, map, Observable } from 'rxjs';
import { Mouvement } from '../../../../core/models/mouvement';
import { SortPipe } from '../../../../core/pipes/sort.pipe';
import { LigneMouvement } from '../../../composants/ligne-mouvement/ligne-mouvement';
import { Router } from '@angular/router';
import { Infos } from '../infos/infos';
import { SearchService } from '../../../../core/services/search.service';

@Component({
  selector: 'app-liste',
  imports: [CommonModule, SortPipe, LigneMouvement, Infos],
  templateUrl: './liste.html',
  styleUrl: './liste.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Liste implements OnInit {
  mouvements$!: Observable<Mouvement[]>;
  mouvement!: Mouvement;

  constructor(
    private mouvementService: MouvementService,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initObservables();
  }

  initObservables(): void {
    const search$ = this.searchService.search$;

    this.mouvements$ = combineLatest([
      search$,
      this.mouvementService.mouvements$,
    ]).pipe(
      map(([search, mouvements]) =>
        mouvements.filter((x) =>
          x.libelle.toLowerCase().includes(search.toLowerCase())
        )
      )
    );

    this.mouvements$.subscribe();
  }

  add(): void {
    this.router.navigateByUrl('/caisse/view/add');
  }

  onSelected(mouvement: Mouvement): void {
    this.mouvement = mouvement;
  }
}
