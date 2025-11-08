import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { InfosPret } from '../../../../core/models/infos-pret';

@Component({
  selector: 'app-membre-card',
  imports: [UpperCasePipe, DatePipe, DecimalPipe],
  templateUrl: './membre-card.component.html',
  styleUrl: './membre-card.component.scss',
})
export class MembreCardComponent {
  @Input()
  membre!: InfosPret;
  @Input()
  showActions: boolean = true;
  @Input()
  isViewPage: boolean = false;
  @Input()
  showInfosMembre: boolean = true;
  baseUrl: string = environment.imagesUrl;

  @Input()
  showActivated: boolean = false;
  @Output()
  onActivateEvent = new EventEmitter<InfosPret>();
  @Input()
  showImageChanged: boolean = false;
  @Output()
  onImageChangeEvent = new EventEmitter<InfosPret>();
  @Input()
  showEditEd: boolean = false;
  @Output()
  onEditEvent = new EventEmitter<InfosPret>();
  @Input()
  showViewed: boolean = false;
  @Output()
  onViewEvent = new EventEmitter<InfosPret>();

  onEdit(): void {
    this.onEditEvent.emit(this.membre);
  }

  onView(): void {
    this.onViewEvent.emit(this.membre);
  }

  onActivate(): void {
    this.onActivateEvent.emit(this.membre);
  }

  onChangeImage(): void {
    this.onImageChangeEvent.emit(this.membre);
  }

  get photo(): string {
    return this.membre.nomSexe &&
      this.membre.nomSexe.toLowerCase().includes('femme')
      ? './assets/images/default_woman.jpg'
      : './assets/images/default_man.jpg';
  }

  get bgColor(): string {
    return this.membre.nomSexe &&
      this.membre.nomSexe.toLowerCase().includes('femme')
      ? 'bg-danger'
      : 'bg-primary';
  }

  get dateStart(): string {
    return this.membre.nomSexe &&
      this.membre.nomSexe.toLowerCase().includes('femme')
      ? 'Née le '
      : 'Né le ';
  }

  get membreStatus(): string {
    return this.membre.estActif ? 'fa-xmark ' : 'fa-check';
  }

  get typeBtn(): string {
    return this.membre.estActif ? 'btn-danger ' : 'btn-success';
  }
}
