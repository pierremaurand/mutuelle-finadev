import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Membre } from '../../../../core/models/membre';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { MembreService } from '../../../../core/services/membre.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MembreCardComponent } from '../membre-card/membre-card.component';
import { SearchService } from '../../../../core/services/search.service';
import { Ligne } from '../ligne/ligne';
import { SortPipe } from '../../../../core/pipes/sort.pipe';
import { AgenceService } from '../../../../core/services/agence.service';
import { Agence } from '../../../../core/models/agence';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-liste',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MembreCardComponent,
    Ligne,
    SortPipe,
  ],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListeComponent implements OnInit {
  membres$!: Observable<Membre[]>;
  agences$!: Observable<Agence[]>;
  search$!: Observable<string>;
  date$!: Observable<string>;
  selectedMembre!: Membre;

  agenceCtrl!: FormControl;

  constructor(
    private membreService: MembreService,
    private searchService: SearchService,
    private agenceService: AgenceService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.initObservables();
  }

  private initForms(): void {
    this.agenceCtrl = this.fb.control('');
  }

  private initObservables(): void {
    this.search$ = this.searchService.search$;
    this.search$.subscribe();
    this.date$ = this.searchService.date$;
    this.date$.subscribe();
    this.agences$ = this.agenceService.agences$;
    this.agences$.subscribe();

    const agence$ = this.agenceCtrl.valueChanges.pipe(
      startWith(this.agenceCtrl.value)
    );

    this.membres$ = combineLatest([
      this.search$,
      this.date$,
      this.membreService.membres$,
      agence$,
    ]).pipe(
      map(([search, date, membres, agence]) =>
        membres.filter(
          (membre: Membre) =>
            membre.nom &&
            membre.nom.toLowerCase().includes(search) &&
            membre.dateAdhesion &&
            membre.dateAdhesion.includes(date) &&
            (agence === '' || membre.agenceId === +agence)
        )
      )
    );

    this.membres$.subscribe();
  }

  add(): void {
    this.router.navigateByUrl('/membre/add/0');
  }

  onEdited(membre: Membre): void {
    this.router.navigateByUrl('/membre/add/' + membre.id);
  }

  onViewed(membre: Membre): void {
    this.router.navigateByUrl('/membre/view/' + membre.id + '/infos');
  }

  onSelected(membre: Membre): void {
    this.selectedMembre = membre;
  }
}
