import { Component, Input } from '@angular/core';
import { Echeance } from '../../../core/models/echeance';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-echeancier-pret',
  imports: [CommonModule, DatePipe],
  templateUrl: './echeancier-pret.component.html',
  styleUrl: './echeancier-pret.component.scss',
})
export class EcheancierPretComponent {
  @Input()
  echeancier: Echeance[] = []; // Adjust type as needed
  @Input()
  nbrEcheances: number = 0; // Adjust type as needed
  @Input()
  echeancierCredit: boolean = true; // Adjust type as needed
  @Input()
  echeancierView: boolean = false; // Adjust type as needed

  get montantTotal(): number {
    return this.echeancier.reduce((total, echeance) => {
      return (
        total +
        (echeance.montantInterets ?? 0) +
        (echeance.montantCapital ?? 0) +
        (echeance.montantCommission ?? 0)
      );
    }, 0);
  }
}
