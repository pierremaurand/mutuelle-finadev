import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { Membre } from '../../../../core/models/membre';
import { MembreService } from '../../../../core/services/membre.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AgenceService } from '../../../../core/services/agence.service';
import { Agence } from '../../../../core/models/agence';
import { environment } from '../../../../../environments/environment';
import { Sexe } from '../../../../core/models/sexe';
import { MembreRequest } from '../../../../core/models/membre-request';
import { MembreCardComponent } from '../membre-card/membre-card.component';
import { InfosPret } from '../../../../core/models/infos-pret';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule, CommonModule, MembreCardComponent],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddComponent implements OnInit {
  request!: FormGroup;
  membre$!: Observable<Membre>;
  agences$!: Observable<Agence[]>;
  agence$!: Observable<Agence>;
  baseUrl: string = environment.imagesUrl;

  nomCtrl!: FormControl;
  sexeCtrl!: FormControl;
  dateNaissanceCtrl!: FormControl;
  lieuNaissanceCtrl!: FormControl;
  agenceIdCtrl!: FormControl;
  dateAdhesionCtrl!: FormControl;
  telephoneCtrl!: FormControl;
  emailCtrl!: FormControl;

  infosMembre!: InfosPret;

  constructor(
    private router: Router,
    private membreService: MembreService,
    private agenceService: AgenceService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.infosMembre = new InfosPret();
    this.initControls();
    this.initForm();
    this.initObservables();
  }

  initControls(): void {
    this.nomCtrl = this.fb.control('', Validators.required);
    this.sexeCtrl = this.fb.control('', Validators.required);
    this.dateNaissanceCtrl = this.fb.control('', Validators.required);
    this.lieuNaissanceCtrl = this.fb.control('', Validators.required);
    this.agenceIdCtrl = this.fb.control('', [
      Validators.required,
      Validators.min(1),
    ]);
    this.dateAdhesionCtrl = this.fb.control('', Validators.required);
    this.telephoneCtrl = this.fb.control('', Validators.required);
    this.emailCtrl = this.fb.control('', Validators.required);
  }

  initForm(): void {
    this.request = this.fb.group({
      id: [0],
      nom: this.nomCtrl,
      sexe: this.sexeCtrl,
      dateNaissance: this.dateNaissanceCtrl,
      lieuNaissance: this.lieuNaissanceCtrl,
      agenceId: this.agenceIdCtrl,
      dateAdhesion: this.dateAdhesionCtrl,
      telephone: this.telephoneCtrl,
      email: this.emailCtrl,
      photo: [''],
      estActif: [true],
    });
  }

  initObservables(): void {
    this.agences$ = this.agenceService.agences$;
    this.agences$.subscribe();

    this.membre$ = this.membreService.membre$;
    this.membre$.subscribe({
      next: (membre: Membre) => {
        this.infosMembre.nom = membre.nom;
        this.infosMembre.photo = membre.photo;
        this.infosMembre.nomSexe = membre.nomSexe;
        this.infosMembre.nomAgence = membre.nomAgence;
        this.infosMembre.dateAdhesion = membre.dateAdhesion;
        this.infosMembre.dateNaissance = membre.dateNaissance;
        this.infosMembre.lieuNaissance = membre.lieuNaissance;
        this.infosMembre.telephone = membre.telephone;
        this.infosMembre.email = membre.email;
        this.infosMembre.estActif = membre.estActif;

        this.request.patchValue({
          id: membre.id as number,
          nom: membre.nom as string,
          sexe: membre.sexe as Sexe,
          dateNaissance: membre.dateNaissance as string,
          lieuNaissance: membre.lieuNaissance as string,
          agenceId: membre.agenceId as number,
          dateAdhesion: membre.dateAdhesion as string,
          telephone: membre.telephone as string,
          email: membre.email as string,
          photo: membre.photo as string,
          estActif: membre.estActif as boolean,
        });
      },
    });

    this.nomCtrl.valueChanges.subscribe({
      next: (nom: string) => {
        this.infosMembre.nom = nom;
      },
    });

    this.dateNaissanceCtrl.valueChanges.subscribe({
      next: (dateNaissance: string) => {
        this.infosMembre.dateNaissance = dateNaissance;
      },
    });

    this.lieuNaissanceCtrl.valueChanges.subscribe({
      next: (lieuNaissance: string) => {
        this.infosMembre.lieuNaissance = lieuNaissance;
      },
    });

    this.telephoneCtrl.valueChanges.subscribe({
      next: (telephone: string) => {
        this.infosMembre.telephone = telephone;
      },
    });

    this.emailCtrl.valueChanges.subscribe({
      next: (email: string) => {
        this.infosMembre.email = email;
      },
    });

    this.dateAdhesionCtrl.valueChanges.subscribe({
      next: (dateAdhesion: string) => {
        this.infosMembre.dateAdhesion = dateAdhesion;
      },
    });

    this.sexeCtrl.valueChanges
      .pipe(
        startWith(this.sexeCtrl.value),
        map((value) => (value === undefined ? Sexe.Masculin : +value))
      )
      .subscribe({
        next: (sexe: Sexe) => {
          this.infosMembre.nomSexe = sexe === Sexe.Masculin ? 'Homme' : 'Femme';
        },
      });

    const agenceId$ = this.agenceIdCtrl.valueChanges.pipe(
      startWith(this.agenceIdCtrl.value),
      map((value) => (value === undefined ? +0 : +value))
    );

    this.agence$ = combineLatest([agenceId$, this.agences$]).pipe(
      map(([id, agences]) => agences.find((x) => x.id === id) ?? new Agence())
    );

    this.agence$.subscribe({
      next: (agence: Agence) => {
        this.infosMembre.nomAgence = agence.nom;
      },
    });
  }

  submitForm(): void {
    if (this.request.valid) {
      this.membreService
        .addOrUpdate(
          this.request.controls['id'].value,
          this.request.value as MembreRequest
        )
        .subscribe({
          next: () => {
            this.toastr.success("L'enregistrement a réussie!", 'Succès');
            this.membreService.getAllMembresFromServer();
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
    this.router.navigateByUrl('/membre');
  }

  private afficheErreur(error: any): string {
    console.log(error.errors[0]);
    if (error.errors) {
      return error.errors[0] || 'Une erreur est survenue!';
    } else {
      return 'Une erreur est survenue!';
    }
  }

  get nomClasse(): string {
    return this.nomCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get sexeClasse(): string {
    return this.sexeCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get agenceIdClasse(): string {
    return this.agenceIdCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get dateNaissanceClasse(): string {
    return this.dateNaissanceCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get lieuNaissanceClasse(): string {
    return this.lieuNaissanceCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get dateAdhesionClasse(): string {
    return this.dateAdhesionCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get telephoneClasse(): string {
    return this.telephoneCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get emailClasse(): string {
    return this.emailCtrl.valid ? 'is-valid' : 'is-invalid';
  }
}
