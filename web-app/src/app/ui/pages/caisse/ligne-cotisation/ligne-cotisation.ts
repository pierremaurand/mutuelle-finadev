import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { Cotisation } from '../../../../core/models/cotisation';

@Component({
  selector: 'app-ligne-cotisation',
  imports: [UpperCasePipe, DecimalPipe, DatePipe],
  templateUrl: './ligne-cotisation.html',
  styleUrl: './ligne-cotisation.scss',
})
export class LigneCotisation {
  @Input()
  item!: { cotisation: Cotisation; checked: boolean };

  @Output()
  onCheckedEvent = new EventEmitter<{
    cotisation: Cotisation;
    checked: boolean;
  }>();
  baseUrl: string = environment.imagesUrl;

  onCheck($event: any) {
    this.item.checked = $event.target.checked;
    this.onCheckedEvent.emit(this.item);
  }

  get photoMembre(): string {
    return this.item.cotisation.photo !== ''
      ? this.baseUrl + '/' + this.item.cotisation.photo
      : this.item.cotisation.nomSexe &&
        this.item.cotisation.nomSexe.toLowerCase().includes('femme')
      ? './assets/images/default_woman.jpg'
      : './assets/images/default_man.jpg';
  }
}
