import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserInfos } from '../../../../core/models/user-infos';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-utilisateur-card',
  imports: [],
  templateUrl: './utilisateur-card.component.html',
  styleUrl: './utilisateur-card.component.scss',
})
export class UtilisateurCardComponent {
  @Input()
  utilisateur!: UserInfos;
  baseUrl: string = environment.imagesUrl;
  @Output()
  updateInfos = new EventEmitter<UserInfos>();
  @Output()
  editUser = new EventEmitter<number>();
  @Output()
  viewUser = new EventEmitter<number>();

  updateEtatUser(): void {
    this.utilisateur.estActif = !this.utilisateur.estActif;
    this.updateInfos.emit(this.utilisateur);
  }

  edit(): void {
    this.editUser.emit(this.utilisateur.id);
  }

  view(): void {
    this.viewUser.emit(this.utilisateur.id);
  }
}
