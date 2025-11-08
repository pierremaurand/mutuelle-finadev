import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EcheancierPretComponent } from '../../../composants/echeancier-pret/echeancier-pret.component';
import { Membre } from '../../../../core/models/membre';
import { MembreService } from '../../../../core/services/membre.service';
import { AvanceService } from '../../../../core/services/avance.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { Agence } from '../../../../core/models/agence';
import { AgenceService } from '../../../../core/services/agence.service';
import { Avance } from '../../../../core/models/avance';
import { CommonModule, DatePipe } from '@angular/common';
import { Echeance } from '../../../../core/models/echeance';
import { Router } from '@angular/router';
import { AvanceRequest } from '../../../../core/models/avance-request';
import { ToastrService } from 'ngx-toastr';
import { MembreCardComponent } from '../../membre/membre-card/membre-card.component';
import { InfosPret } from '../../../../core/models/infos-pret';

@Component({
  selector: 'app-add',
  imports: [
    MembreCardComponent,
    EcheancierPretComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddComponent implements OnInit {
  request!: FormGroup;
  id: number = 0;
  membreIdCtrl!: FormControl;
  montantCapitalCtrl!: FormControl;
  dureeCtrl!: FormControl;
  dateDemandeCtrl!: FormControl;
  dateDecaissementCtrl!: FormControl;
  differeCtrl!: FormControl;

  agenceCtrl!: FormControl;

  membres$!: Observable<Membre[]>;
  membre$!: Observable<Membre>;
  agences$!: Observable<Agence[]>;
  avance$!: Observable<Avance>;

  echeancier: Echeance[] = [];

  infosPret!: InfosPret;

  constructor(
    private membreService: MembreService,
    private agenceService: AgenceService,
    private avanceService: AvanceService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.infosPret = new InfosPret();
    this.initControls();
    this.initForm();
    this.initObservables();
  }

  initControls(): void {
    this.differeCtrl = this.fb.control(0, [
      Validators.min(0),
      Validators.max(11),
    ]);
    this.membreIdCtrl = this.fb.control('', Validators.required);
    this.montantCapitalCtrl = this.fb.control('', [
      Validators.required,
      Validators.min(10000),
      Validators.max(300000),
    ]);
    this.dureeCtrl = this.fb.control('', [
      Validators.required,
      Validators.min(1),
      Validators.max(9),
    ]); // Duree in months
    this.dateDemandeCtrl = this.fb.control('', Validators.required);
    this.dateDecaissementCtrl = this.fb.control('', Validators.required);
    this.agenceCtrl = this.fb.control('', Validators.required);
  }

  initForm(): void {
    this.request = this.fb.group({
      membreId: this.membreIdCtrl,
      montantCapital: this.montantCapitalCtrl,
      duree: this.dureeCtrl,
      dateDemande: this.dateDemandeCtrl,
      dateDecaissement: this.dateDecaissementCtrl,
    });
  }

  initObservables(): void {
    this.agences$ = this.agenceService.agences$;
    this.avance$ = this.avanceService.avance$;

    const membreId$ = this.membreIdCtrl.valueChanges.pipe(
      startWith(this.agenceCtrl.value)
    );

    const agence$ = this.agenceCtrl.valueChanges.pipe(
      startWith(this.agenceCtrl.value)
    );

    this.montantCapitalCtrl.valueChanges.subscribe({
      next: (value: number) => {
        this.infosPret.montantCapital = value;
      },
    });

    this.dureeCtrl.valueChanges.subscribe({
      next: (value: number) => {
        this.infosPret.duree = value;
        this.genererEcheancier();
      },
    });

    this.dateDecaissementCtrl.valueChanges.subscribe({
      next: () => {
        this.genererEcheancier();
      },
    });

    this.differeCtrl.valueChanges
      .pipe(startWith(this.differeCtrl.value))
      .subscribe({
        next: () => {
          this.genererEcheancier();
        },
      });

    this.membres$ = combineLatest([agence$, this.membreService.membres$]).pipe(
      map(([agence, membres]) =>
        membres.filter(
          (membre: Membre) => membre.agenceId === +agence || agence === ''
        )
      )
    );

    this.membre$ = combineLatest([membreId$, this.membres$]).pipe(
      map(
        ([membreId, membres]) =>
          membres.filter((membre: Membre) => membre.id === +membreId)[0] ||
          new Membre()
      )
    );

    this.membres$.subscribe();
    this.membre$.subscribe({
      next: (membre: Membre) => {
        this.infosPret.nom = membre.nom;
        this.infosPret.photo = membre.photo;
        this.infosPret.nomSexe = membre.nomSexe;
      },
    });
  }

  genererEcheancier(): void {
    let dateDebut = new Date();
    let curDate = new Date();
    let capital: number | undefined = 0;
    let montantCapital: number | undefined = 0;
    let nbrEcheances: number | undefined = 0;
    let resteCapital: number | undefined = 0;
    let differe: number = 0;

    differe = this.differeCtrl.value;

    dateDebut = new Date(this.dateDecaissementCtrl.value);
    if (dateDebut.getDate() < 10) {
      dateDebut.setMonth(dateDebut.getMonth() - 1);
    }
    dateDebut.setDate(25);
    nbrEcheances = this.dureeCtrl.value;
    montantCapital = this.montantCapitalCtrl.value;

    if (montantCapital && nbrEcheances) {
      capital = Math.round(montantCapital / nbrEcheances);
      resteCapital = montantCapital - capital * nbrEcheances;
    }

    if (this.dureeCtrl.valid && this.dateDecaissementCtrl.valid) {
      this.echeancier = [];
      curDate = dateDebut;
      if (nbrEcheances) {
        for (let i = 1; i <= nbrEcheances; i++) {
          if (curDate.getMonth() == 11) {
            curDate.setFullYear(curDate.getFullYear() + 1);
            curDate.setMonth(differe);
          } else {
            curDate.setMonth(curDate.getMonth() + differe + 1);
          }
          let echeance: Echeance = new Echeance();
          echeance.dateEcheance =
            this.datePipe.transform(curDate, 'yyyy-MM-dd') ?? '';
          echeance.montantCapital = capital;
          if (i === 1) {
            echeance.montantCapital = capital + resteCapital;
          }
          this.echeancier.push(echeance);
        }
      }
    }
  }

  onCancel(): void {
    this.router.navigateByUrl('/avance');
  }

  submitForm(): void {
    if (this.request.valid) {
      this.avanceService
        .add(this.request.value as AvanceRequest, this.echeancier as Echeance[])
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
      this.toastr.error('Tous les champs doivent être renseignés.');
    }
  }

  get agenceClass(): string {
    return this.agenceCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get membreClass(): string {
    return this.membreIdCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get montantCapitalClass(): string {
    return this.montantCapitalCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get dureeClass(): string {
    return this.dureeCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get dateDemandeClass(): string {
    return this.dateDemandeCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get dateDecaissementClass(): string {
    return this.dateDecaissementCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get differeClass(): string {
    return this.differeCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  onBack(): void {
    this.router.navigateByUrl('/avance');
  }
}
