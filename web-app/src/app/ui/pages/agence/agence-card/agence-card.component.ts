import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Agence } from '../../../../core/models/agence';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-agence-card',
  imports: [UpperCasePipe],
  templateUrl: './agence-card.component.html',
  styleUrl: './agence-card.component.scss',
})
export class AgenceCardComponent {
  @Input()
  agence!: Agence;
  @Input()
  showActions: boolean = true;
  @Output()
  editEvent = new EventEmitter<Agence>();
  @Output()
  viewEvent = new EventEmitter<Agence>();

  onEdit(): void {
    this.editEvent.emit(this.agence);
  }

  onView(): void {
    this.viewEvent.emit(this.agence);
  }
}
