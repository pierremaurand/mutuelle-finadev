import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Banque } from '../../../../core/models/banque';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [UpperCasePipe],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  @Input()
  banque!: Banque;
  @Input()
  showActions: boolean = true;
  @Output()
  editEvent = new EventEmitter<Banque>();
  @Output()
  viewEvent = new EventEmitter<Banque>();

  onEdit(): void {
    this.editEvent.emit(this.banque);
  }

  onView(): void {
    this.viewEvent.emit(this.banque);
  }
}
