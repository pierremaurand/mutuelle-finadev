import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Caisse } from '../../../../core/models/caisse';
import { Observable } from 'rxjs';
import { CaisseService } from '../../../../core/services/caisse.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SortPipe } from '../../../../core/pipes/sort.pipe';
import { LigneCaisse } from '../ligne-caisse/ligne-caisse';
import { CardCaisse } from '../card-caisse/card-caisse';

@Component({
  selector: 'app-liste-caisse',
  imports: [CommonModule, LigneCaisse, CardCaisse, SortPipe],
  templateUrl: './liste-caisse.html',
  styleUrl: './liste-caisse.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Liste implements OnInit {
  caisses$!: Observable<Caisse[]>;
  selectedCaisse!: Caisse;

  constructor(private caisseService: CaisseService, private router: Router) {}

  ngOnInit(): void {
    this.initObservables();
    this.caisseService.getAllCaissesFromServer();
  }

  initObservables(): void {
    this.caisses$ = this.caisseService.caisses$;
    this.caisses$.subscribe();
  }

  add(id: number): void {
    this.router.navigateByUrl('/caisse/add/' + id);
  }

  onSelected(caisse: Caisse): void {
    this.selectedCaisse = caisse;
  }

  onEdited(caisse: Caisse): void {
    this.add(caisse.id!);
  }

  onViewed(caisse: Caisse): void {
    this.view(caisse.id!);
  }

  view(id: number): void {
    this.router.navigateByUrl('/caisse/view/' + id);
  }
}
