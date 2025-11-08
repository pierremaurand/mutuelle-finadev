import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CaisseService } from '../../../../core/services/caisse.service';
import { MouvementService } from '../../../../core/services/mouvement.service';
import { AdhesionService } from '../../../../core/services/adhesion.service';
import { combineLatest, map, Observable } from 'rxjs';
import { Caisse } from '../../../../core/models/caisse';
import { Adhesion } from '../../../../core/models/adhesion';
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
import { LigneAdhesion } from '../ligne-adhesion/ligne-adhesion';

@Component({
  selector: 'app-adhesion-caisse',
  imports: [ReactiveFormsModule, AsyncPipe, LigneAdhesion],
  templateUrl: './adhesion-caisse.html',
  styleUrl: './adhesion-caisse.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdhesionCaisse {
  private caisseService = inject(CaisseService);
  private mouvementService = inject(MouvementService);
  private adhesionService = inject(AdhesionService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  caisse$!: Observable<Caisse>;
  caisse!: Caisse;
  adhesions$!: Observable<Adhesion[]>;
  request!: FormGroup;
  items: any[] = [];

  checkBoxLabel: string = 'Tout selectionner';

  @Input()
  set id(value: number) {
    this.initForm();
    this.caisse$ = this.caisseService.caisse$;
    this.caisse$.subscribe((caisse) => (this.caisse = caisse));
    this.caisseService.getCaisseFromServer(value);
    this.adhesions$ = combineLatest([
      this.caisse$,
      this.adhesionService.adhesions$,
    ]).pipe(
      map(([caisse, adhesions]) =>
        adhesions
          .filter(
            (adhesion) =>
              adhesion.dateAdhesion?.includes(caisse.dateCaisse ?? '') &&
              adhesion.status &&
              adhesion.status.includes('Non payée')
          )
          .sort((a, b) => ((a.id ?? 0) < (b.id ?? 0) ? 1 : -1))
      )
    );
    this.adhesions$.subscribe((adhesions) => {
      this.lines.clear();
      adhesions.forEach(() => this.items.push({ checked: false }));
    });
    this.adhesionService.getAllAdhesionsFromServer();
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

  onCheck(item: { adhesion: Adhesion; checked: boolean }) {
    if (item.checked) {
      this.addLine(item.adhesion);
    } else {
      this.removeLine(item.adhesion);
    }
  }

  addLine(adhesion: Adhesion): void {
    const existingIndex = this.lines.controls.findIndex(
      (line) => line.value.id === adhesion.id
    );
    if (existingIndex === -1) {
      const adhesionForm = this.fb.group({
        caisseId: [this.caisse.id, Validators.required],
        montantCredit: [adhesion.montant, Validators.required],
        libelle: [
          'Paiement adhésion du membre ' + adhesion.nom,
          Validators.required,
        ],
        dateMouvement: [this.caisse.dateCaisse, Validators.required],
        adhesionId: [adhesion.id, Validators.required],
        membreId: [adhesion.membreId, Validators.required],
      });
      this.lines.push(adhesionForm);
    }
  }

  removeLine(adhesion: Adhesion): void {
    const index = this.lines.controls.findIndex(
      (line) => line.value.adhesionId === adhesion.id
    );
    if (index !== -1) {
      this.lines.removeAt(index);
    }
  }

  onCheckAll(adhesions: Adhesion[], $event: any) {
    this.lines.clear();
    if ($event.target.checked) {
      this.checkBoxLabel = 'Tout déselectionner';
      adhesions.forEach((adhesion) => {
        this.addLine(adhesion);
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
