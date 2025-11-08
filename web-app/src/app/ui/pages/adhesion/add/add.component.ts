import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { AdhesionService } from '../../../../core/services/adhesion.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Membre } from '../../../../core/models/membre';
import { MembreService } from '../../../../core/services/membre.service';
import { AdhesionRequest } from '../../../../core/models/adhesion-request';
import { environment } from '../../../../../environments/environment';
import { Ligne } from '../ligne/ligne';

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
  dateAdhesionCtrl!: FormControl;

  baseUrl: string = environment.imagesUrl;

  constructor(
    private router: Router,
    private adhesionService: AdhesionService,
    private membreService: MembreService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initControls();
    this.initForm();
    this.initObservables();
  }

  initControls(): void {
    this.dateAdhesionCtrl = this.fb.control('');
  }

  initForm(): void {
    this.request = this.fb.group({
      lines: this.fb.array([]),
    });
  }

  get lines(): FormArray {
    return this.request.get('lines') as FormArray;
  }

  initObservables(): void {
    const dateAdhesion$ = this.dateAdhesionCtrl.valueChanges.pipe(
      startWith(this.dateAdhesionCtrl.value),
      map((value) => value.substr(0, 7))
    );

    this.membres$ = combineLatest([
      dateAdhesion$,
      this.adhesionService.adhesions$,
      this.membreService.membres$,
    ]).pipe(
      map(([date, adhesions, membres]) =>
        membres.filter(
          (membre: Membre) =>
            !adhesions.find((a) => a.membreId === membre.id) &&
            membre.dateAdhesion &&
            membre.dateAdhesion.includes(date)
        )
      )
    );

    this.membres$.subscribe({
      next: (membres: Membre[]) => {
        this.lines.clear();
        membres.forEach((membre: Membre) => {
          this.addAdhesion(membre);
        });
      },
    });
  }

  addAdhesion(membre: Membre) {
    var adhesionForm = this.fb.group({
      membreId: [membre.id, [Validators.required]],
      dateAdhesion: [membre.dateAdhesion, [Validators.required]],
      montant: [3000, [Validators.required, Validators.min(3000)]],
    });
    this.lines.push(adhesionForm);
  }

  submitForm(): void {
    if (this.request.valid) {
      this.adhesionService
        .add(this.lines.value as AdhesionRequest[])
        .subscribe({
          next: () => {
            this.toastr.success("L'enregistrement a réussie!", 'Succès');
            this.adhesionService.getAllAdhesionsFromServer();
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
    this.router.navigateByUrl('/adhesion');
  }

  private afficheErreur(error: any): string {
    console.log(error.errors[0]);
    if (error.errors) {
      return error.errors[0] || 'Une erreur est survenue!';
    } else {
      return 'Une erreur est survenue!';
    }
  }

  photoMembre(membre: Membre): string {
    return membre.photo && membre.photo !== ''
      ? this.baseUrl + '/' + membre.photo
      : membre.nomSexe && membre.nomSexe.toLowerCase().includes('femme')
      ? './assets/images/default_woman.jpg'
      : './assets/images/default_man.jpg';
  }
}
