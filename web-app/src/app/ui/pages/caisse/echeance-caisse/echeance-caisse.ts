import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CaisseService } from '../../../../core/services/caisse.service';
import { MouvementService } from '../../../../core/services/mouvement.service';
import { EcheanceService } from '../../../../core/services/echeance.service';
import { combineLatest, map, Observable } from 'rxjs';
import { Caisse } from '../../../../core/models/caisse';
import { Echeance } from '../../../../core/models/echeance';
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
import { LigneEcheance } from '../ligne-echeance/ligne-echeance';

@Component({
  selector: 'app-echeance-caisse',
  imports: [ReactiveFormsModule, AsyncPipe, LigneEcheance],
  templateUrl: './echeance-caisse.html',
  styleUrl: './echeance-caisse.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EcheanceCaisse {
  private caisseService = inject(CaisseService);
  private mouvementService = inject(MouvementService);
  private echeanceService = inject(EcheanceService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  caisse$!: Observable<Caisse>;
  caisse!: Caisse;
  echeances$!: Observable<Echeance[]>;
  request!: FormGroup;
  items: any[] = [];

  checkBoxLabel: string = 'Tout selectionner';

  @Input()
  set id(value: number) {
    this.initForm();
    this.caisse$ = this.caisseService.caisse$;
    this.caisse$.subscribe((caisse) => (this.caisse = caisse));
    this.caisseService.getCaisseFromServer(value);
    this.echeances$ = combineLatest([
      this.caisse$,
      this.echeanceService.echeances$,
    ]).pipe(
      map(([caisse, echeances]) =>
        echeances
          .filter(
            (echeance) =>
              (echeance.dateEcheance?.includes(caisse.dateCaisse ?? '') ||
                echeance.dateAnticipation?.includes(caisse.dateCaisse ?? '')) &&
              echeance.status &&
              (echeance.status.includes('Non payée') ||
                echeance.status.includes('Anticipée'))
          )
          .sort((a, b) =>
            (a.montantTotal ?? 0) < (b.montantTotal ?? 0) ? 1 : -1
          )
      )
    );
    this.echeances$.subscribe((echeances) => {
      this.lines.clear();
      echeances.forEach(() => this.items.push({ checked: false }));
    });
    this.echeanceService.getAllEcheancesFromServer();
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

  onCheck(item: { echeance: Echeance; checked: boolean }) {
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
          caisseId: [this.caisse.id, Validators.required],
          montantCredit: [echeance.montantTotal, Validators.required],
          libelle: [
            'Paiement échéance du membre ' + echeance.nom,
            Validators.required,
          ],
          dateMouvement: [this.caisse.dateCaisse, Validators.required],
          echeanceId: [echeance.id, Validators.required],
          avanceId: [echeance.avanceId],
          membreId: [echeance.membreId],
        });
        this.lines.push(echeanceForm);
      } else {
        const echeanceForm = this.fb.group({
          caisseId: [this.caisse.id, Validators.required],
          montantCredit: [echeance.montantTotal, Validators.required],
          libelle: [
            'Paiement échéance du membre ' + echeance.nom,
            Validators.required,
          ],
          dateMouvement: [this.caisse.dateCaisse, Validators.required],
          echeanceId: [echeance.id, Validators.required],
          creditId: [echeance.creditId],
          membreId: [echeance.membreId],
          montantCapital: [echeance.montantCapital],
          montantCommission: [echeance.montantCommission],
          montantInterets: [echeance.montantInterets],
        });
        this.lines.push(echeanceForm);
      }
    }
  }

  removeLine(echeance: Echeance): void {
    const index = this.lines.controls.findIndex(
      (line) => line.value.echeanceId === echeance.id
    );
    if (index !== -1) {
      this.lines.removeAt(index);
    }
  }

  onCheckAll(echeances: Echeance[], $event: any) {
    this.lines.clear();
    if ($event.target.checked) {
      this.checkBoxLabel = 'Tout déselectionner';
      echeances.forEach((echeance) => {
        this.addLine(echeance);
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
}
