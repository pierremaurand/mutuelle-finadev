import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { BanqueService } from '../../../../core/services/banque.service';
import { MouvementService } from '../../../../core/services/mouvement.service';
import { combineLatest, map, Observable } from 'rxjs';
import { Banque } from '../../../../core/models/banque';
import { Mouvement } from '../../../../core/models/mouvement';
import { LigneMouvement } from '../../caisse/ligne-mouvement/ligne-mouvement';
import { CardMouvement } from '../../caisse/card-mouvement/card-mouvement';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-infos',
  imports: [LigneMouvement, CardMouvement, AsyncPipe],
  templateUrl: './infos.html',
  styleUrl: './infos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Infos implements OnInit {
  private banqueService = inject(BanqueService);
  private mouvementService = inject(MouvementService);
  banque$!: Observable<Banque>;
  banque!: Banque;
  mouvements$!: Observable<Mouvement[]>;
  selectedMouvement!: Mouvement;

  ngOnInit(): void {
    this.banque$ = this.banqueService.banque$;

    this.mouvements$ = combineLatest([
      this.banque$,
      this.mouvementService.mouvements$,
    ]).pipe(
      map(([banque, mouvements]) =>
        mouvements
          .filter((mouvement) => mouvement.banqueId === banque.id)
          .sort((a, b) => (a.id < b.id ? 1 : -1))
      )
    );
  }

  onSelected(mouvement: Mouvement): void {
    this.selectedMouvement = mouvement;
  }
}
