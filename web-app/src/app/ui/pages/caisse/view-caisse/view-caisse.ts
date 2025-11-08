import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CaisseService } from '../../../../core/services/caisse.service';
import { Observable, tap } from 'rxjs';
import { Caisse } from '../../../../core/models/caisse';
import { Widget } from '../../../composants/widget/widget';
import { Menu } from '../menu/menu';
import { UserInfos } from '../../../../core/models/user-infos';
import { UtilisateurService } from '../../../../core/services/utilisateur.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-view-caisse',
  imports: [CommonModule, RouterOutlet, Widget, AsyncPipe, DatePipe, Menu],
  templateUrl: './view-caisse.html',
  styleUrl: './view-caisse.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ViewCaisse implements OnInit {
  caisse$!: Observable<Caisse>;
  caisse!: Caisse;
  user$!: Observable<UserInfos>;
  user!: UserInfos;
  labelSolde: string = 'Solde caisse';

  constructor(
    private caisseService: CaisseService,
    private autService: AuthService
  ) {}

  ngOnInit(): void {
    this.initObservables();
  }

  initObservables(): void {
    this.autService.getUserInfosFromServer();
    this.caisse$ = this.caisseService.caisse$.pipe(
      tap((caisse: Caisse) => (this.caisse = caisse))
    );
    this.user$ = this.autService.userInfos$.pipe(
      tap((user: UserInfos) => (this.user = user))
    );

    this.caisse$.subscribe();
    this.user$.subscribe();
  }
}
