import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Caisse } from '../../../../core/models/caisse';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-ligne-caisse',
  imports: [UpperCasePipe, DecimalPipe, DatePipe],
  templateUrl: './ligne-caisse.html',
  styleUrl: './ligne-caisse.scss',
})
export class LigneCaisse {
  @Input()
  caisse!: Caisse;
  @Output()
  selectedEvent = new EventEmitter<Caisse>();

  onSelected(): void {
    this.selectedEvent.emit(this.caisse);
  }
}
