import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Banque } from '../../../../core/models/banque';
import { Observable } from 'rxjs';
import { BanqueService } from '../../../../core/services/banque.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Ligne } from '../ligne/ligne';
import { SortPipe } from '../../../../core/pipes/sort.pipe';
import { Card } from '../card/card';

@Component({
  selector: 'app-liste',
  imports: [CommonModule, Ligne, Card, SortPipe],
  templateUrl: './liste.html',
  styleUrl: './liste.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Liste implements OnInit {
  banques$!: Observable<Banque[]>;
  selectedBanque!: Banque;

  constructor(private banqueService: BanqueService, private router: Router) {}

  ngOnInit(): void {
    this.initObservables();
    this.banqueService.getAllBanquesFromServer();
  }

  initObservables(): void {
    this.banques$ = this.banqueService.banques$;
    this.banques$.subscribe();
  }

  add(id: number): void {
    this.router.navigateByUrl('/banque/add/' + id);
  }

  onSelected(banque: Banque): void {
    this.selectedBanque = banque;
  }

  onEdited(banque: Banque): void {
    this.add(banque.id!);
  }

  onViewed(banque: Banque): void {
    this.view(banque.id!);
  }

  view(id: number): void {
    this.router.navigateByUrl('/banque/view/' + id);
  }
}
