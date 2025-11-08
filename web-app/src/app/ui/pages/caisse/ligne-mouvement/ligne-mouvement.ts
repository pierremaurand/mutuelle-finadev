import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Mouvement } from '../../../../core/models/mouvement';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-ligne-mouvement',
  imports: [UpperCasePipe, DatePipe, DecimalPipe],
  templateUrl: './ligne-mouvement.html',
  styleUrl: './ligne-mouvement.scss',
})
export class LigneMouvement {
  @Input() mouvement!: Mouvement;
  @Output() selectEvent = new EventEmitter<Mouvement>();

  get montant(): number {
    return this.mouvement.montantCredit + this.mouvement.montantDebit;
  }

  onSelected(): void {
    this.selectEvent.emit(this.mouvement);
  }
}
