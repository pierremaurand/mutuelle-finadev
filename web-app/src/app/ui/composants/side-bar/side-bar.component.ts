import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TokenService } from '../../../core/token/token.service';
import { combineLatest, map, Observable, tap } from 'rxjs';
import { UserInfos } from '../../../core/models/user-infos';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { CaisseService } from '../../../core/services/caisse.service';
import { Caisse } from '../../../core/models/caisse';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideBarComponent implements OnInit {
  userInfos$!: Observable<UserInfos>;
  user!: UserInfos;
  caisse$!: Observable<Caisse>;
  caisse!: Caisse;
  photo: string = './assets/images/default_man.jpg';
  baseUrl: string = environment.imagesUrl;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private caisseService: CaisseService
  ) {}

  ngOnInit(): void {
    this.authService.getUserInfosFromServer();
    this.caisseService.getAllCaissesFromServer();
    this.userInfos$ = this.authService.userInfos$.pipe(
      tap((infos) => {
        this.user = infos;
        if (infos.photo) {
          this.photo = this.baseUrl + '/' + infos.photo;
        }
      })
    );
    this.caisse$ = combineLatest([
      this.userInfos$,
      this.caisseService.caisses$,
    ]).pipe(
      map(
        ([user, caisses]) =>
          caisses.filter((x) => x.agentId === user.id)[0] ?? new Caisse()
      )
    );

    this.caisse$.subscribe((caisse: Caisse) => {
      this.caisse = caisse;
    });
  }

  logout(): void {
    this.tokenService.logout();
  }
}
