import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CaisseService } from '../../../../core/services/caisse.service';
import { MouvementService } from '../../../../core/services/mouvement.service';
import { CotisationService } from '../../../../core/services/cotisation.service';
import { combineLatest, map, Observable } from 'rxjs';
import { Caisse } from '../../../../core/models/caisse';
import { Cotisation } from '../../../../core/models/cotisation';
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
import { LigneCotisation } from '../ligne-cotisation/ligne-cotisation';

@Component({
  selector: 'app-cotisation-caisse',
  imports: [ReactiveFormsModule, AsyncPipe, LigneCotisation],
  templateUrl: './cotisation-caisse.html',
  styleUrl: './cotisation-caisse.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CotisationCaisse {
  private caisseService = inject(CaisseService);
  private mouvementService = inject(MouvementService);
  private cotisationService = inject(CotisationService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  caisse$!: Observable<Caisse>;
  caisse!: Caisse;
  cotisations$!: Observable<Cotisation[]>;
  request!: FormGroup;
  items: any[] = [];

  checkBoxLabel: string = 'Tout selectionner';

  @Input()
  set id(value: number) {
    this.initForm();
    this.caisse$ = this.caisseService.caisse$;
    this.caisse$.subscribe((caisse) => (this.caisse = caisse));
    this.caisseService.getCaisseFromServer(value);
    this.cotisations$ = combineLatest([
      this.caisse$,
      this.cotisationService.cotisations$,
    ]).pipe(
      map(([caisse, cotisations]) =>
        cotisations
          .filter(
            (cotisation) =>
              cotisation.dateCotisation?.includes(caisse.dateCaisse ?? '') &&
              cotisation.status &&
              cotisation.status.includes('Non payée')
          )
          .sort((a, b) => ((a.id ?? 0) < (b.id ?? 0) ? 1 : -1))
      )
    );
    this.cotisations$.subscribe((cotisations) => {
      this.lines.clear();
      cotisations.forEach(() => this.items.push({ checked: false }));
    });
    this.cotisationService.getAllCotisationsFromServer();
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

  onCheck(item: { cotisation: Cotisation; checked: boolean }) {
    if (item.checked) {
      this.addLine(item.cotisation);
    } else {
      this.removeLine(item.cotisation);
    }
  }

  addLine(cotisation: Cotisation): void {
    const existingIndex = this.lines.controls.findIndex(
      (line) => line.value.id === cotisation.id
    );
    if (existingIndex === -1) {
      const cotisationForm = this.fb.group({
        caisseId: [this.caisse.id, Validators.required],
        montantCredit: [cotisation.retenue, Validators.required],
        libelle: [
          'Paiement cotisation du membre ' + cotisation.nom,
          Validators.required,
        ],
        dateMouvement: [this.caisse.dateCaisse, Validators.required],
        cotisationId: [cotisation.id, Validators.required],
        membreId: [cotisation.membreId, Validators.required],
      });
      this.lines.push(cotisationForm);
    }
  }

  removeLine(cotisation: Cotisation): void {
    const index = this.lines.controls.findIndex(
      (line) => line.value.cotisationId === cotisation.id
    );
    if (index !== -1) {
      this.lines.removeAt(index);
    }
  }

  onCheckAll(cotisations: Cotisation[], $event: any) {
    this.lines.clear();
    if ($event.target.checked) {
      this.checkBoxLabel = 'Tout déselectionner';
      cotisations.forEach((cotisation) => {
        this.addLine(cotisation);
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
