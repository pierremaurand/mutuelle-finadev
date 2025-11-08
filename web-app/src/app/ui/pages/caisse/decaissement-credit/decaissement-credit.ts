import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CaisseService } from '../../../../core/services/caisse.service';
import { MouvementService } from '../../../../core/services/mouvement.service';
import { CreditService } from '../../../../core/services/credit.service';
import { combineLatest, map, Observable } from 'rxjs';
import { Caisse } from '../../../../core/models/caisse';
import { Credit } from '../../../../core/models/credit';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Mouvement } from '../../../../core/models/mouvement';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe } from '@angular/common';
import { LigneCredit } from '../ligne-credit/ligne-credit';

@Component({
  selector: 'app-credit-caisse',
  imports: [ReactiveFormsModule, AsyncPipe, LigneCredit],
  templateUrl: './decaissement-credit.html',
  styleUrl: './decaissement-credit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DecaissementCredit {
  private caisseService = inject(CaisseService);
  private mouvementService = inject(MouvementService);
  private creditService = inject(CreditService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  caisse$!: Observable<Caisse>;
  caisse!: Caisse;
  credits$!: Observable<Credit[]>;
  request!: FormGroup;
  items: any[] = [];

  checkBoxLabel: string = 'Tout selectionner';

  @Input()
  set id(value: number) {
    this.initForm();
    this.caisse$ = this.caisseService.caisse$;
    this.caisse$.subscribe((caisse) => (this.caisse = caisse));
    this.caisseService.getCaisseFromServer(value);
    this.credits$ = combineLatest([
      this.caisse$,
      this.creditService.credits$,
    ]).pipe(
      map(([caisse, credits]) =>
        credits
          .filter(
            (credit) =>
              credit.dateDecaissement?.includes(caisse.dateCaisse ?? '') &&
              credit.status &&
              credit.status.includes('Validée')
          )
          .sort((a, b) => ((a.id ?? 0) < (b.id ?? 0) ? 1 : -1))
      )
    );
    this.credits$.subscribe((credits) => {
      this.lines.clear();
      credits.forEach(() => this.items.push({ checked: false }));
    });
    this.creditService.getAllCreditsFromServer();
  }

  initForm(): void {
    this.request = this.fb.group({
      lines: this.fb.array([]),
    });
  }

  get lines(): FormArray {
    return this.request.get('lines') as FormArray;
  }

  onCancel(): void {
    this.router.navigateByUrl('/caisse/view/' + this.caisse.id);
  }

  onCheck(item: { credit: Credit; checked: boolean }) {
    if (item.checked) {
      this.addLine(item.credit);
    } else {
      this.removeLine(item.credit);
    }
  }

  addLine(credit: Credit): void {
    const existingIndex = this.lines.controls.findIndex(
      (line) => line.value.id === credit.id
    );
    if (existingIndex === -1) {
      const creditForm = this.fb.group({
        caisseId: [this.caisse.id, Validators.required],
        montantDebit: [
          credit.montantCapital,
          [
            Validators.required,
            Validators.min(0),
            Validators.max(this.caisse.solde ?? 0),
          ],
        ],
        libelle: [
          'Décaissement credit du membre ' + credit.nom,
          Validators.required,
        ],
        dateMouvement: [this.caisse.dateCaisse, Validators.required],
        creditId: [credit.id, Validators.required],
        membreId: [credit.membreId, Validators.required],
      });
      this.lines.push(creditForm);
    }
  }

  removeLine(credit: Credit): void {
    const index = this.lines.controls.findIndex(
      (line) => line.value.creditId === credit.id
    );
    if (index !== -1) {
      this.lines.removeAt(index);
    }
  }

  onCheckAll(credits: Credit[], $event: any) {
    this.lines.clear();
    if ($event.target.checked) {
      this.checkBoxLabel = 'Tout déselectionner';
      credits.forEach((credit) => {
        this.addLine(credit);
      });
    } else {
      this.checkBoxLabel = 'Tout selectionner';
    }
    this.items = this.items.map(() => ({ checked: $event.target.checked }));
  }

  submitForm(): void {
    if (this.request.valid && this.lines.length > 0) {
      this.mouvementService.addAll(this.lines.value as Mouvement[]).subscribe({
        next: () => {
          this.toastr.success("L'enregistrement a réussie!", 'Succès');
          this.onCancel();
        },
        error: (error) => {
          console.log(error);
          if (error.status === 400) {
            this.toastr.error(error.error, 'Erreur de validation');
          } else {
            this.toastr.error('Une erreur est survenue!', 'Erreur');
          }
        },
      });
    } else {
      this.toastr.error('Vous devez cocher au moins une échéance.', 'Erreur');
    }
  }

  checkMontant(): boolean {
    let total = 0;
    this.lines.value.forEach((e: Mouvement) => {
      total += e.montantDebit;
    });
    return (this.caisse.solde ?? 0 >= total) as boolean;
  }
}
