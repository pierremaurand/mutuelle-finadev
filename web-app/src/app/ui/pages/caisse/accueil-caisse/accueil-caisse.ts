import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { combineLatest, map, Observable, tap } from 'rxjs';
import { Caisse } from '../../../../core/models/caisse';
import { Mouvement } from '../../../../core/models/mouvement';
import { CaisseService } from '../../../../core/services/caisse.service';
import { MouvementService } from '../../../../core/services/mouvement.service';
import { AsyncPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { LigneMouvement } from '../ligne-mouvement/ligne-mouvement';
import { CardMouvement } from '../card-mouvement/card-mouvement';
import { ToastrService } from 'ngx-toastr';
import { PrintMouvement } from '../print-mouvement/print-mouvement';
import { AuthService } from '../../../../core/services/auth.service';
import { UserInfos } from '../../../../core/models/user-infos';

@Component({
  selector: 'app-accueil-caisse',
  imports: [
    AsyncPipe,
    UpperCasePipe,
    LigneMouvement,
    CardMouvement,
    PrintMouvement,
  ],
  templateUrl: './accueil-caisse.html',
  styleUrl: './accueil-caisse.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccueilCaisse {
  private caisseService = inject(CaisseService);
  private mouvementService = inject(MouvementService);
  private toastrService = inject(ToastrService);
  private authService = inject(AuthService);
  private datePipe = inject(DatePipe);
  caisse$!: Observable<Caisse>;
  userInfos$!: Observable<UserInfos>;
  userInfos!: UserInfos;
  caisse!: Caisse;
  mouvements$!: Observable<Mouvement[]>;
  selectedMouvement!: Mouvement;

  @Input()
  set id(value: number) {
    this.userInfos$ = this.authService.userInfos$.pipe(
      tap((userInfos) => (this.userInfos = userInfos))
    );
    this.userInfos$.subscribe();
    this.caisse$ = this.caisseService.caisse$.pipe(
      tap((caisse: Caisse) => {
        this.caisse = caisse;
      })
    );
    this.caisseService.getCaisseFromServer(value);
    this.mouvements$ = combineLatest([
      this.caisse$,
      this.mouvementService.mouvements$,
    ]).pipe(
      map(([caisse, mouvements]) =>
        mouvements
          .filter(
            (mouvement) =>
              mouvement.caisseId === +value &&
              mouvement.dateMouvement.includes(caisse.dateCaisse ?? '')
          )
          .sort((a, b) => (a.id < b.id ? 1 : -1))
      )
    );
    this.mouvementService.getAllMouvementsFromServer();
  }

  onSelected(mouvement: Mouvement): void {
    this.selectedMouvement = mouvement;
  }

  onCloture(): void {
    let dateCaisse = new Date();

    if (this.caisse.solde === 0 && this.caisse.dateCaisse) {
      dateCaisse = new Date(this.caisse.dateCaisse);
      dateCaisse.setDate(dateCaisse.getDate() + 1);
      this.caisse.dateCaisse =
        this.datePipe.transform(dateCaisse, 'yyyy-MM-dd') ?? '';
      this.caisseService
        .addOrUpdate(this.caisse.id ?? 0, this.caisse)
        .subscribe(() => {
          this.caisseService.getCaisseFromServer(this.caisse.id ?? 0);
          this.mouvementService.getAllMouvementsFromServer();
          this.toastrService.success(
            'La clôture terminée avec succès!',
            'SUccess'
          );
        });
    } else {
      this.toastrService.error('La caisse doit être remontée!', 'Error');
    }
  }
}
