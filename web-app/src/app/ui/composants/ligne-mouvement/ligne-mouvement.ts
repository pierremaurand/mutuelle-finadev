import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Mouvement } from '../../../core/models/mouvement';
import {
  CommonModule,
  DatePipe,
  DecimalPipe,
  UpperCasePipe,
} from '@angular/common';

@Component({
  selector: 'app-ligne-mouvement',
  imports: [CommonModule, DecimalPipe, DatePipe, UpperCasePipe],
  templateUrl: './ligne-mouvement.html',
  styleUrl: './ligne-mouvement.scss',
})
export class LigneMouvement {
  @Input()
  mouvement!: Mouvement;
  @Output()
  onSelectedEvent = new EventEmitter<Mouvement>();

  onSelected(): void {
    this.onSelectedEvent.emit(this.mouvement);
  }

  get typeBtn(): string {
    return this.mouvement.montantCredit ? 'btn-success' : 'btn-danger';
  }

  get btnIcon(): string {
    return this.mouvement.montantCredit ? 'fa-arrow-down' : 'fa-arrow-up';
  }
}
