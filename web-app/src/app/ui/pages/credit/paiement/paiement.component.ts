import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CreditService } from '../../../../core/services/credit.service';
import { EcheanceService } from '../../../../core/services/echeance.service';
import { Echeance } from '../../../../core/models/echeance';
import { combineLatest, map, Observable, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Credit } from '../../../../core/models/credit';
import { LigneEcheance } from '../../../composants/ligne-echeance/ligne-echeance';
import { RemboursementRequest } from '../../../../core/models/remboursement-request';

@Component({
  selector: 'app-paiement',
  imports: [CommonModule, AsyncPipe, ReactiveFormsModule, LigneEcheance],
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PaiementComponent implements OnInit {
  id: number = 0;
  credit$!: Observable<Credit>;
  echeancier$!: Observable<Echeance[]>;
  request!: FormGroup;
  datePaiementCtrl!: FormControl;
  items: any[] = [];

  checkBoxLabel: string = 'Cochez tout';

  constructor(
    private creditService: CreditService,
    private echeanceService: EcheanceService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initObservables();
  }

  initForm(): void {
    this.datePaiementCtrl = this.fb.control('', Validators.required);
    this.request = this.fb.group({
      dateAnticipation: this.datePaiementCtrl,
      lines: this.fb.array([]),
    });
  }

  get lines(): FormArray {
    return this.request.get('lines') as FormArray;
  }

  initObservables(): void {
    this.datePaiementCtrl.valueChanges
      .pipe(
        tap((value) => {
          this.lines.controls.forEach((line) => {
            line.get('datePaiement')?.setValue(value);
          });
          console.log(this.lines.value);
        })
      )
      .subscribe();

    this.credit$ = this.creditService.credit$;
    this.credit$.subscribe((credit) => {
      this.id = credit.id ?? 0;
    });
    this.echeancier$ = combineLatest([
      this.credit$,
      this.echeanceService.echeances$,
    ]).pipe(
      map(([credit, echeances]) =>
        echeances.filter(
          (e) =>
            e.creditId === credit.id &&
            e.montantCapitalRestant &&
            e.montantCapitalRestant > 0
        )
      )
    );
    this.echeancier$.subscribe((echeances) => {
      this.lines.clear();
      echeances.forEach(() => this.items.push({ checked: false }));
    });
    this.credit$.subscribe();
  }

  submitForm(): void {
    if (this.request.valid && this.lines.length > 0) {
      this.creditService
        .anticipationPaiement(
          this.id,
          this.lines.value as RemboursementRequest[]
        )
        .subscribe({
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

  onCancel(): void {
    this.router.navigateByUrl('/credit/view/' + this.id + '/infos');
  }

  onCheck(item: { echeance: Echeance; checked: boolean }) {
    console.log(item);
    if (item.checked) {
      this.addLine(item.echeance);
    } else {
      this.removeLine(item.echeance);
    }
    console.log(this.lines.value);
  }

  addLine(echeance: Echeance): void {
    const existingIndex = this.lines.controls.findIndex(
      (line) => line.value.id === echeance.id
    );
    if (existingIndex === -1) {
      const echeanceForm = this.fb.group({
        id: [echeance.id, Validators.required],
        creditId: [echeance.creditId, Validators.required],
        datePaiement: [this.datePaiementCtrl.value, Validators.required],
      });

      this.lines.push(echeanceForm);
    }
  }

  removeLine(echeance: Echeance): void {
    const index = this.lines.controls.findIndex(
      (line) => line.value.id === echeance.id
    );
    console.log(index);
    if (index !== -1) {
      this.lines.removeAt(index);
    }
  }

  onCheckAll(echeancier: Echeance[], $event: any) {
    if ($event.target.checked) {
      this.checkBoxLabel = 'Décochez tout';
      echeancier.forEach((echeance) => {
        this.addLine(echeance);
      });
    } else {
      this.checkBoxLabel = 'Cochez tout';
      echeancier.forEach((echeance) => {
        this.removeLine(echeance);
      });
    }
    this.items = this.items.map(() => ({ checked: $event.target.checked }));
    console.log(this.lines.value);
  }

  get datePaiementClass(): string {
    return this.datePaiementCtrl.valid ? 'is-valid' : 'is-invalid';
  }
}
