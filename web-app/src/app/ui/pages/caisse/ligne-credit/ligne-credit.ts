import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { Credit } from '../../../../core/models/credit';

@Component({
  selector: 'app-ligne-credit',
  imports: [UpperCasePipe, DecimalPipe, DatePipe],
  templateUrl: './ligne-credit.html',
  styleUrl: './ligne-credit.scss',
})
export class LigneCredit {
  @Input()
  item!: { credit: Credit; checked: boolean };

  @Output()
  onCheckedEvent = new EventEmitter<{ credit: Credit; checked: boolean }>();
  baseUrl: string = environment.imagesUrl;

  onCheck($event: any) {
    this.item.checked = $event.target.checked;
    this.onCheckedEvent.emit(this.item);
  }

  get photoMembre(): string {
    return this.item.credit.photo !== ''
      ? this.baseUrl + '/' + this.item.credit.photo
      : this.item.credit.nomSexe &&
        this.item.credit.nomSexe.toLowerCase().includes('femme')
      ? './assets/images/default_woman.jpg'
      : './assets/images/default_man.jpg';
  }
}
