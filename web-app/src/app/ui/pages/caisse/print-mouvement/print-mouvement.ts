import { Component, Input } from '@angular/core';
import { Mouvement } from '../../../../core/models/mouvement';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { ToWords } from 'to-words';

@Component({
  selector: 'app-print-mouvement',
  imports: [DatePipe, UpperCasePipe, DecimalPipe],
  templateUrl: './print-mouvement.html',
  styleUrl: './print-mouvement.scss',
})
export class PrintMouvement {
  @Input()
  mouvement!: Mouvement;

  get titre(): string {
    return this.mouvement.montantCredit > 0 ? 'Entrée' : 'Sortie';
  }

  get montant(): number {
    return this.mouvement.montantCredit > 0
      ? this.mouvement.montantCredit
      : this.mouvement.montantDebit;
  }

  get montantEnLettres(): string {
    const toWords = new ToWords({ localeCode: 'fr-FR' });
    return toWords.convert(this.montant);
  }
}
