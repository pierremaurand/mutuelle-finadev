import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CaisseService } from '../../../../core/services/caisse.service';
import { MouvementService } from '../../../../core/services/mouvement.service';
import { AvanceService } from '../../../../core/services/avance.service';
import { combineLatest, map, Observable } from 'rxjs';
import { Caisse } from '../../../../core/models/caisse';
import { Avance } from '../../../../core/models/avance';
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
import { LigneAvance } from '../ligne-avance/ligne-avance';
import e from 'express';

@Component({
  selector: 'app-avance-caisse',
  imports: [ReactiveFormsModule, AsyncPipe, LigneAvance],
  templateUrl: './decaissement-avance.html',
  styleUrl: './decaissement-avance.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DecaissementAvance {
  private caisseService = inject(CaisseService);
  private mouvementService = inject(MouvementService);
  private avanceService = inject(AvanceService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  caisse$!: Observable<Caisse>;
  caisse!: Caisse;
  avances$!: Observable<Avance[]>;
  request!: FormGroup;
  items: any[] = [];

  checkBoxLabel: string = 'Tout selectionner';

  @Input()
  set id(value: number) {
    this.initForm();
    this.caisse$ = this.caisseService.caisse$;
    this.caisse$.subscribe((caisse) => (this.caisse = caisse));
    this.caisseService.getCaisseFromServer(value);
    this.avances$ = combineLatest([
      this.caisse$,
      this.avanceService.avances$,
    ]).pipe(
      map(([caisse, avances]) =>
        avances
          .filter(
            (avance) =>
              avance.dateDecaissement?.includes(caisse.dateCaisse ?? '') &&
              avance.status &&
              avance.status.includes('Validée')
          )
          .sort((a, b) => ((a.id ?? 0) < (b.id ?? 0) ? 1 : -1))
      )
    );
    this.avances$.subscribe((avances) => {
      this.lines.clear();
      avances.forEach(() => this.items.push({ checked: false }));
    });
    this.avanceService.getAllAvancesFromServer();
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

  onCheck(item: { avance: Avance; checked: boolean }) {
    if (item.checked) {
      this.addLine(item.avance);
    } else {
      this.removeLine(item.avance);
    }
  }

  addLine(avance: Avance): void {
    const existingIndex = this.lines.controls.findIndex(
      (line) => line.value.id === avance.id
    );
    if (existingIndex === -1) {
      const avanceForm = this.fb.group({
        caisseId: [this.caisse.id, Validators.required],
        montantDebit: [
          avance.montantCapital,
          [
            Validators.required,
            Validators.min(0),
            Validators.max(this.caisse.solde ?? 0),
          ],
        ],
        libelle: [
          'Décaissement avance du membre ' + avance.nom,
          Validators.required,
        ],
        dateMouvement: [this.caisse.dateCaisse, Validators.required],
        avanceId: [avance.id, Validators.required],
        membreId: [avance.membreId, Validators.required],
      });
      this.lines.push(avanceForm);
    }
  }

  removeLine(avance: Avance): void {
    const index = this.lines.controls.findIndex(
      (line) => line.value.avanceId === avance.id
    );
    if (index !== -1) {
      this.lines.removeAt(index);
    }
  }

  onCheckAll(avances: Avance[], $event: any) {
    this.lines.clear();
    if ($event.target.checked) {
      this.checkBoxLabel = 'Tout déselectionner';
      avances.forEach((avance) => {
        this.addLine(avance);
      });
    } else {
      this.checkBoxLabel = 'Tout selectionner';
    }
    this.items = this.items.map(() => ({ checked: $event.target.checked }));
  }

  submitForm(): void {
    if (this.request.valid && this.lines.length > 0 && this.checkMontant()) {
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
