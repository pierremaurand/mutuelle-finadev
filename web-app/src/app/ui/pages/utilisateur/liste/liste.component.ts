import { UtilisateurService } from './../../../../core/services/utilisateur.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfos } from '../../../../core/models/user-infos';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe, CommonModule } from '@angular/common';
import { UtilisateurCardComponent } from '../utilisateur-card/utilisateur-card.component';
import { Router } from '@angular/router';
import { UpdateUtilisateurActifRequest } from '../../../../core/models/update-utilisateur-actif-request';

@Component({
  selector: 'app-liste',
  imports: [CommonModule, AsyncPipe, UtilisateurCardComponent],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListeComponent implements OnInit {
  utilisateurs$!: Observable<UserInfos[]>;
  activateRequest!: UpdateUtilisateurActifRequest;

  constructor(
    private utilisateurService: UtilisateurService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initObservables();
  }

  initObservables(): void {
    this.utilisateurs$ = this.utilisateurService.utilisateurs$;
    this.utilisateurs$.subscribe();
  }

  updateInfos(utilisateur: UserInfos): void {
    if (utilisateur.id) {
      this.activateRequest = {
        estActif: utilisateur.estActif ?? false,
      };
      this.utilisateurService
        .updateActif(utilisateur.id, this.activateRequest)
        .subscribe({
          next: () => {
            this.toastr.success(
              "Le statut de l'utilisateur a été mis à jour avec succès!"
            );
          },
          error: (error) => {
            this.toastr.error(
              "La mise à jour du statut de l'utilisateur a échoué. Veuillez reéssayer SVP!."
            );
            console.error('Mise à jour du statut érronné:', error);
          },
        });
    }
  }

  ajouterUtilisateur(id: any): void {
    this.router.navigateByUrl('/utilisateur/add/' + id);
  }

  editUser(id: number): void {
    this.ajouterUtilisateur(id);
  }

  viewUser(id: number): void {
    this.router.navigateByUrl('/utilisateur/view/' + id);
  }
}
