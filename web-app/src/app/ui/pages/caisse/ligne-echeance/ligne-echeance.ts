import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { Echeance } from '../../../../core/models/echeance';

@Component({
  selector: 'app-ligne-echeance',
  imports: [UpperCasePipe, DecimalPipe, DatePipe],
  templateUrl: './ligne-echeance.html',
  styleUrl: './ligne-echeance.scss',
})
export class LigneEcheance {
  @Input()
  item!: { echeance: Echeance; checked: boolean };

  @Output()
  onCheckedEvent = new EventEmitter<{ echeance: Echeance; checked: boolean }>();
  baseUrl: string = environment.imagesUrl;

  onCheck($event: any) {
    this.item.checked = $event.target.checked;
    this.onCheckedEvent.emit(this.item);
  }

  get photoMembre(): string {
    return this.item.echeance.photo !== ''
      ? this.baseUrl + '/' + this.item.echeance.photo
      : this.item.echeance.nomSexe &&
        this.item.echeance.nomSexe.toLowerCase().includes('femme')
      ? './assets/images/default_woman.jpg'
      : './assets/images/default_man.jpg';
  }
}
