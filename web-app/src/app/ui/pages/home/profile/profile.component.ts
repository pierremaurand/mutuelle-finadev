import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserInfos } from '../../../../core/models/user-infos';
import { CommonModule } from '@angular/common';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';
import { UtilisateurService } from '../../../../core/services/utilisateur.service';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileComponent implements OnInit {
  utilisateur$!: Observable<UserInfos>;
  photo: SafeUrl = './assets/images/default_man.jpg';
  baseUrl: string = environment.imagesUrl;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.initObservables();
    this.authService.getUserInfosFromServer();
  }

  private initObservables(): void {
    this.utilisateur$ = this.authService.userInfos$;
    this.utilisateur$.subscribe();
  }

  onChangePassword(): void {
    this.router.navigateByUrl('/home/profile/password');
  }

  onChangeImage(): void {
    this.router.navigateByUrl('/home/profile/image');
  }
}
