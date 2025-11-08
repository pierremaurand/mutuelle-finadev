import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { combineLatest, map, Observable, startWith, tap } from 'rxjs';
import { CotisationService } from '../../../../core/services/cotisation.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Membre } from '../../../../core/models/membre';
import { MembreService } from '../../../../core/services/membre.service';
import { CotisationRequest } from '../../../../core/models/cotisation-request';
import { AgenceService } from '../../../../core/services/agence.service';
import { Agence } from '../../../../core/models/agence';
import { Ligne } from '../ligne/ligne';
import { CotisationEvent } from '../../../../core/models/cotisation-event';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule, CommonModule, AsyncPipe, Ligne],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddComponent implements OnInit {
  request!: FormGroup;
  membres$!: Observable<Membre[]>;
  agences$!: Observable<Agence[]>;

  dateCotisationCtrl!: FormControl;
  agenceCtrl!: FormControl;

  constructor(
    private router: Router,
    private cotisationService: CotisationService,
    private membreService: MembreService,
    private agenceService: AgenceService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initControls();
    this.initForm();
    this.initObservables();
  }

  initForm(): void {
    this.request = this.fb.group({
      agence: this.agenceCtrl,
      dateCotisation: this.dateCotisationCtrl,
      lines: this.fb.array([]),
    });
  }

  get lines(): FormArray {
    return this.request.get('lines') as FormArray;
  }

  initControls(): void {
    this.dateCotisationCtrl = this.fb.control('', Validators.required);
    this.agenceCtrl = this.fb.control('', Validators.required);
  }

  initObservables(): void {
    this.agences$ = this.agenceService.agences$;
    this.agences$.subscribe();

    const agence$ = this.agenceCtrl.valueChanges.pipe(
      startWith(this.agenceCtrl.value)
    );

    const dateCotisation$ = this.dateCotisationCtrl.valueChanges.pipe(
      startWith(this.dateCotisationCtrl.value),
      tap((value) => {
        this.lines.controls.forEach((line) => {
          line.get('dateCotisation')?.setValue(value);
        });
      }),
      map((value) => value.substr(0, 7))
    );

    this.membres$ = combineLatest([
      agence$,
      dateCotisation$,
      this.cotisationService.cotisations$,
      this.membreService.membres$,
    ]).pipe(
      map(([agence, dateCotisation, cotisations, membres]) =>
        membres.filter(
          (membre: Membre) =>
            !cotisations.find(
              (a) =>
                a.membreId === membre.id &&
                a.dateCotisation &&
                a.dateCotisation.includes(dateCotisation)
            ) &&
            membre.dateAdhesion &&
            membre.dateAdhesion.substring(0, 7) <= dateCotisation &&
            membre.agenceId === +agence &&
            membre.estActif
        )
      )
    );

    this.membres$.subscribe({
      next: (membres: Membre[]) => {
        this.initForm();
        this.lines.clear();
        membres.forEach((membre: Membre) => {
          this.addCotisation(membre);
        });
      },
    });
  }

  addCotisation(membre: Membre) {
    var cotisationForm = this.fb.group({
      membreId: [membre.id, Validators.required],
      dateCotisation: [this.dateCotisationCtrl.value, Validators.required],
      salaire: ['', [Validators.required, Validators.min(0)]],
    });
    this.lines.push(cotisationForm);
  }

  submitForm(): void {
    if (this.request.valid) {
      this.cotisationService
        .add(this.lines.value as CotisationRequest[])
        .subscribe({
          next: () => {
            this.toastr.success("L'enregistrement a réussie!", 'Succès');
            this.cotisationService.getAllCotisationsFromServer();
            this.onCancel();
          },
          error: (error) => {
            console.log(error);
            if (error.status === 400) {
              this.toastr.error(
                this.afficheErreur(error.error),
                'Erreur de validation'
              );
            } else {
              this.toastr.error('Une erreur est survenue!', 'Erreur');
            }
          },
        });
    } else {
      this.toastr.error('Tous les champs doivent être renseignés.');
    }
  }

  onCancel(): void {
    this.router.navigateByUrl('/cotisation');
  }

  private afficheErreur(error: any): string {
    if (error.errors) {
      return error.errors[0] || 'Une erreur est survenue!';
    } else {
      return 'Une erreur est survenue!';
    }
  }

  get agenceClasse(): string {
    return this.agenceCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get dateCotisationClasse(): string {
    return this.dateCotisationCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  onSalaireChange(event: CotisationEvent): void {
    this.lines.controls
      .find((x) => x.value.membreId === event.membreId)
      ?.get('salaire')
      ?.setValue(event.salaire || 0);
  }
}
