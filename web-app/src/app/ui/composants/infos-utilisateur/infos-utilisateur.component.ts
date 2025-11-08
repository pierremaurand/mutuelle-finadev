import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfos } from '../../../core/models/user-infos';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-infos-utilisateur',
  imports: [CommonModule],
  templateUrl: './infos-utilisateur.component.html',
  styleUrl: './infos-utilisateur.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InfosUtilisateurComponent implements OnInit {
  utilisateur$!: Observable<UserInfos>;

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit(): void {
    this.utilisateur$ = this.utilisateurService.utilisateur$;
    this.utilisateur$.subscribe();
  }
}
