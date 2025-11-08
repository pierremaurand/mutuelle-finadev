import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Agence } from '../../../../core/models/agence';
import { Observable } from 'rxjs';
import { AgenceService } from '../../../../core/services/agence.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AgenceCardComponent } from '../agence-card/agence-card.component';
import { Ligne } from '../ligne/ligne';
import { SortPipe } from '../../../../core/pipes/sort.pipe';

@Component({
  selector: 'app-liste',
  imports: [CommonModule, Ligne, AgenceCardComponent, SortPipe],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListeComponent implements OnInit {
  agences$!: Observable<Agence[]>;
  selectedAgence!: Agence;

  constructor(private agenceService: AgenceService, private router: Router) {}

  ngOnInit(): void {
    this.initObservables();
    this.agenceService.getAllAgencesFromServer();
  }

  initObservables(): void {
    this.agences$ = this.agenceService.agences$;
    this.agences$.subscribe();
  }

  add(id: number): void {
    this.router.navigateByUrl('/agence/add/' + id);
  }

  onSelected(agence: Agence): void {
    this.selectedAgence = agence;
  }

  onEdited(agence: Agence): void {
    this.add(agence.id!);
  }

  onViewed(agence: Agence): void {
    this.view(agence.id!);
  }

  view(id: number): void {
    this.router.navigateByUrl('/agence/view/' + id);
  }
}
