import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserInfos } from '../../../../core/models/user-infos';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';
import { UtilisateurService } from '../../../../core/services/utilisateur.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import InfosUtilisateurComponent from '../../../composants/infos-utilisateur/infos-utilisateur.component';

@Component({
  selector: 'app-view',
  imports: [CommonModule, InfosUtilisateurComponent],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ViewComponent implements OnInit {
  utilisateur$!: Observable<UserInfos>;
  photo: SafeUrl = './assets/images/default_man.jpg';
  baseUrl: string = environment.imagesUrl;

  constructor(
    private route: ActivatedRoute,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.utilisateur$ = this.utilisateurService.utilisateur$;
    this.utilisateurService.getUtilisateur(id);
    this.utilisateur$.subscribe();
  }
}
