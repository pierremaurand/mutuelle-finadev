import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Membre } from '../../../../core/models/membre';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { Sexe } from '../../../../core/models/sexe';

@Component({
  selector: 'app-ligne',
  imports: [CommonModule, UpperCasePipe],
  templateUrl: './ligne.html',
  styleUrl: './ligne.scss',
})
export class Ligne {
  @Input()
  membre!: Membre;
  @Output()
  selectedEvent = new EventEmitter<Membre>();
  baseUrl: string = environment.imagesUrl;

  onSelected(): void {
    this.selectedEvent.emit(this.membre);
  }

  get photo(): string {
    return this.membre.sexe == Sexe.Feminin
      ? './assets/images/default_woman.jpg'
      : './assets/images/default_man.jpg';
  }

  get color(): string {
    return this.membre.sexe === Sexe.Feminin ? 'text-danger' : 'text-primary';
  }

  get border(): string {
    return this.membre.sexe === Sexe.Feminin
      ? 'border-danger'
      : 'border-primary';
  }

  get sexeIcon(): string {
    return this.membre.sexe === Sexe.Feminin ? 'fa-person-dress' : 'fa-person';
  }
}
