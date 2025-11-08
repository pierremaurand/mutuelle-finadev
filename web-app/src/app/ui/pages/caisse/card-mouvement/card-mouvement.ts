import { Component, Input } from '@angular/core';
import { Mouvement } from '../../../../core/models/mouvement';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-mouvement',
  imports: [UpperCasePipe, DecimalPipe, DatePipe],
  templateUrl: './card-mouvement.html',
  styleUrl: './card-mouvement.scss',
})
export class CardMouvement {
  @Input()
  mouvement!: Mouvement;
  @Input()
  showAction: boolean = false;

  get montant(): number {
    return (
      (this.mouvement.montantCredit ?? 0) + (this.mouvement.montantDebit ?? 0)
    );
  }

  onPrint(): void {
    window.print();
  }
}
