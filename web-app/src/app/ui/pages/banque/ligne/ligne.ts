import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Banque } from '../../../../core/models/banque';
import { DecimalPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-ligne',
  imports: [UpperCasePipe, DecimalPipe],
  templateUrl: './ligne.html',
  styleUrl: './ligne.scss',
})
export class Ligne {
  @Input()
  banque!: Banque;
  @Output()
  selectedEvent = new EventEmitter<Banque>();

  onSelected(): void {
    this.selectedEvent.emit(this.banque);
  }
}
