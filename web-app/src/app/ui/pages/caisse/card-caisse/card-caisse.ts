import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Caisse } from '../../../../core/models/caisse';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-card-caisse',
  imports: [UpperCasePipe],
  templateUrl: './card-caisse.html',
  styleUrl: './card-caisse.scss',
})
export class CardCaisse {
  @Input()
  caisse!: Caisse;
  @Input()
  showActions: boolean = true;
  @Output()
  editEvent = new EventEmitter<Caisse>();
  @Output()
  viewEvent = new EventEmitter<Caisse>();

  onEdit(): void {
    this.editEvent.emit(this.caisse);
  }

  onView(): void {
    this.viewEvent.emit(this.caisse);
  }
}
