import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from '../menu/menu';
import { Observable } from 'rxjs';
import { Mouvement } from '../../../../core/models/mouvement';
import { MouvementService } from '../../../../core/services/mouvement.service';

@Component({
  selector: 'app-view',
  imports: [CommonModule, RouterOutlet, Menu],
  templateUrl: './view.html',
  styleUrl: './view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class View implements OnInit {
  mouvements$!: Observable<Mouvement[]>;

  constructor(private mouvementService: MouvementService) {}

  ngOnInit(): void {
    this.initObservables();
  }

  initObservables(): void {
    this.mouvements$ = this.mouvementService.mouvements$;
    this.mouvements$.subscribe();
  }
}
