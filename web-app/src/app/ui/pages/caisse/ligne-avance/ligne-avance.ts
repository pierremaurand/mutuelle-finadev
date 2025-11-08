import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { Avance } from '../../../../core/models/avance';

@Component({
  selector: 'app-ligne-avance',
  imports: [UpperCasePipe, DecimalPipe, DatePipe],
  templateUrl: './ligne-avance.html',
  styleUrl: './ligne-avance.scss',
})
export class LigneAvance {
  @Input()
  item!: { avance: Avance; checked: boolean };

  @Output()
  onCheckedEvent = new EventEmitter<{ avance: Avance; checked: boolean }>();
  baseUrl: string = environment.imagesUrl;

  onCheck($event: any) {
    this.item.checked = $event.target.checked;
    this.onCheckedEvent.emit(this.item);
  }

  get photoMembre(): string {
    return this.item.avance.photo !== ''
      ? this.baseUrl + '/' + this.item.avance.photo
      : this.item.avance.nomSexe &&
        this.item.avance.nomSexe.toLowerCase().includes('femme')
      ? './assets/images/default_woman.jpg'
      : './assets/images/default_man.jpg';
  }
}
