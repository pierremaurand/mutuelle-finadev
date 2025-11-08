import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { InfosPret } from '../../../../core/models/infos-pret';

@Component({
  selector: 'app-ligne',
  imports: [CommonModule, UpperCasePipe],
  templateUrl: './ligne.html',
  styleUrl: './ligne.scss',
})
export class Ligne {
  @Input()
  adhesion!: InfosPret;
  @Output()
  selectedEvent = new EventEmitter<InfosPret>();
  baseUrl: string = environment.imagesUrl;

  onSelected(): void {
    this.selectedEvent.emit(this.adhesion);
  }

  get photo(): string {
    return this.adhesion.nomSexe?.toLowerCase().includes('femme')
      ? './assets/images/default_woman.jpg'
      : './assets/images/default_man.jpg';
  }

  get color(): string {
    return this.adhesion.nomSexe?.toLowerCase().includes('femme')
      ? 'text-danger'
      : 'text-primary';
  }

  get border(): string {
    return this.adhesion.nomSexe?.toLowerCase().includes('femme')
      ? 'border-danger'
      : 'border-primary';
  }

  get sexeIcon(): string {
    return this.adhesion.nomSexe?.toLowerCase().includes('femme')
      ? 'fa-person-dress'
      : 'fa-person';
  }

  get montant(): number {
    return this.adhesion.montant ?? 3000;
  }
}
