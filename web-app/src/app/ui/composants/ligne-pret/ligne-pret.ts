import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InfosPret } from '../../../core/models/infos-pret';
import { DatePipe, DecimalPipe } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ligne-pret',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './ligne-pret.html',
  styleUrl: './ligne-pret.scss',
})
export class LignePret {
  @Input()
  infos!: InfosPret;
  @Input()
  baseUrl: string = environment.imagesUrl;
  @Output()
  onSelectedEvent = new EventEmitter<InfosPret>();

  get photoMembre(): string {
    return this.infos.photo !== ''
      ? this.baseUrl + '/' + this.infos.photo
      : this.infos.nomSexe && this.infos.nomSexe.toLowerCase().includes('femme')
      ? './assets/images/default_woman.jpg'
      : './assets/images/default_man.jpg';
  }

  get color(): string {
    return this.infos.retenue
      ? 'text-primary'
      : this.infos.montantCapitalRestant === 0
      ? 'text-success'
      : 'text-danger';
  }

  get border(): string {
    return this.infos.retenue
      ? 'border-primary'
      : this.infos.montantCapitalRestant === 0
      ? 'border-success'
      : 'border-danger';
  }

  get montant(): number {
    return this.infos.retenue ?? this.infos.montantCapitalRestant ?? 0;
  }

  get dateLigne(): string {
    return this.infos.dateCotisation ?? this.infos.dateDecaissement ?? '';
  }

  get dateFormat(): string {
    return this.infos.retenue ? 'MM/yyyy' : 'dd/MM/yyyy';
  }

  onSelected(): void {
    this.onSelectedEvent.emit(this.infos);
  }
}
