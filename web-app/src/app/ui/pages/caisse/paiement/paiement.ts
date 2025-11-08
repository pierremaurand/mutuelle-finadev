import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EcheanceService } from '../../../../core/services/echeance.service';
import { Echeance } from '../../../../core/models/echeance';
import { combineLatest, map, Observable, startWith } from 'rxjs';
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
import { LigneEcheance } from '../../../composants/ligne-echeance/ligne-echeance';
import { RemboursementRequest } from '../../../../core/models/remboursement-request';

@Component({
  selector: 'app-paiement',
  imports: [CommonModule, AsyncPipe, ReactiveFormsModule, LigneEcheance],
  templateUrl: './paiement.html',
  styleUrl: './paiement.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PaiementComponent implements OnInit {
  echeancier$!: Observable<Echeance[]>;
  request!: FormGroup;
  datePaiementCtrl!: FormControl;
  items: any[] = [];

  checkBoxLabel: string = 'Cochez tout';

  constructor(
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
    this.datePaiementCtrl = this.fb.control('');
    this.request = this.fb.group({
      lines: this.fb.array([]),
    });
  }

  get lines(): FormArray {
    return this.request.get('lines') as FormArray;
  }

  initObservables(): void {
    const datePaiement$ = this.datePaiementCtrl.valueChanges.pipe(
      startWith(this.datePaiementCtrl.value),
      map((value) => value.substr(0, 7))
    );

    // this.echeancier$ = this.echeanceService.echeances$;

    this.echeancier$ = combineLatest([
      datePaiement$,
      this.echeanceService.echeances$,
    ]).pipe(
      map(([datePaiement, echeances]) =>
        echeances.filter(
          (e) =>
            e.montantCapitalRestant &&
            e.montantCapitalRestant > 0 &&
            e.dateEcheance &&
            e.dateEcheance.includes(datePaiement)
        )
      )
    );

    this.echeancier$.subscribe((echeances) => {
      this.lines.clear();
      echeances.forEach(() => this.items.push({ checked: false }));
    });

    datePaiement$.subscribe();
  }

  submitForm(): void {
    if (this.request.valid && this.lines.length > 0) {
      this.echeanceService
        .paiementEcheances(this.lines.value as RemboursementRequest[])
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
    this.router.navigateByUrl('/caisse');
  }

  onCheck(item: { echeance: Echeance; checked: boolean }) {
    console.log(item);
    if (item.checked) {
      this.addLine(item.echeance);
    } else {
      this.removeLine(item.echeance);
    }
  }

  addLine(echeance: Echeance): void {
    const existingIndex = this.lines.controls.findIndex(
      (line) => line.value.id === echeance.id
    );
    if (existingIndex === -1) {
      if (echeance.avanceId) {
        const echeanceForm = this.fb.group({
          id: [echeance.id, Validators.required],
          avanceId: [echeance.avanceId, Validators.required],
          datePaiement: [echeance.dateEcheance, Validators.required],
        });
        this.lines.push(echeanceForm);
      } else {
        const echeanceForm = this.fb.group({
          id: [echeance.id, Validators.required],
          creditId: [echeance.creditId, Validators.required],
          datePaiement: [echeance.dateEcheance, Validators.required],
        });
        this.lines.push(echeanceForm);
      }
    }
  }

  removeLine(echeance: Echeance): void {
    const index = this.lines.controls.findIndex(
      (line) => line.value.id === echeance.id
    );
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
  }

  get datePaiementClass(): string {
    return this.datePaiementCtrl.valid ? 'is-valid' : 'is-invalid';
  }
}
