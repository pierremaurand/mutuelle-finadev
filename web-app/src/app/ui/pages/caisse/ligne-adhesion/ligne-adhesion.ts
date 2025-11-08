import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { Adhesion } from '../../../../core/models/adhesion';

@Component({
  selector: 'app-ligne-adhesion',
  imports: [UpperCasePipe, DecimalPipe, DatePipe],
  templateUrl: './ligne-adhesion.html',
  styleUrl: './ligne-adhesion.scss',
})
export class LigneAdhesion {
  @Input()
  item!: { adhesion: Adhesion; checked: boolean };

  @Output()
  onCheckedEvent = new EventEmitter<{ adhesion: Adhesion; checked: boolean }>();
  baseUrl: string = environment.imagesUrl;

  onCheck($event: any) {
    this.item.checked = $event.target.checked;
    this.onCheckedEvent.emit(this.item);
  }

  get photoMembre(): string {
    return this.item.adhesion.photo !== ''
      ? this.baseUrl + '/' + this.item.adhesion.photo
      : this.item.adhesion.nomSexe &&
        this.item.adhesion.nomSexe.toLowerCase().includes('femme')
      ? './assets/images/default_woman.jpg'
      : './assets/images/default_man.jpg';
  }
}
