import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { combineLatest, startWith, tap } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AvanceRequest } from '../../../../core/models/avance-request';
import { ToastrService } from 'ngx-toastr';
import { MouvementService } from '../../../../core/services/mouvement.service';
import { Infos } from '../infos/infos';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule, CommonModule, Infos],
  templateUrl: './add.html',
  styleUrl: './add.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddComponent implements OnInit {
  request!: FormGroup;
  typeMouvementCtrl!: FormControl;
  montantCtrl!: FormControl;
  montantDebitCtrl!: FormControl;
  montantCreditCtrl!: FormControl;
  libelleCtrl!: FormControl;
  dateMouvementCtrl!: FormControl;

  constructor(
    private mouvementService: MouvementService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initControls();
    this.initForm();
    this.initObservables();
  }

  initControls(): void {
    this.typeMouvementCtrl = this.fb.control('', Validators.required);
    this.montantCtrl = this.fb.control('', [
      Validators.required,
      Validators.min(0),
    ]);
    this.dateMouvementCtrl = this.fb.control('', Validators.required);
    this.montantCreditCtrl = this.fb.control(0, [
      Validators.required,
      Validators.min(0),
    ]);
    this.montantDebitCtrl = this.fb.control(0, [
      Validators.required,
      Validators.min(0),
    ]);
    this.libelleCtrl = this.fb.control('', Validators.required);
  }

  initForm(): void {
    this.request = this.fb.group({
      dateMouvement: this.dateMouvementCtrl,
      montantDebit: this.montantDebitCtrl,
      montantCredit: this.montantCreditCtrl,
      libelle: this.libelleCtrl,
    });
  }

  initObservables(): void {
    const typeChange$ = this.typeMouvementCtrl.valueChanges.pipe(
      startWith(this.typeMouvementCtrl.value)
    );
    const montantChange$ = this.montantCtrl.valueChanges;
    combineLatest([typeChange$, montantChange$])
      .pipe(
        tap(([typeMouvement, montantMouvement]) => {
          this.montantDebitCtrl.setValue(0);
          this.montantCreditCtrl.setValue(0);
          if (+typeMouvement === 1) {
            this.montantCreditCtrl.setValue(montantMouvement);
          } else if (+typeMouvement === 2) {
            this.montantDebitCtrl.setValue(montantMouvement);
          }
        })
      )
      .subscribe();
  }

  onCancel(): void {
    this.router.navigateByUrl('/caisse');
  }

  submitForm(): void {
    if (this.request.valid) {
      this.mouvementService.add(this.request.value as AvanceRequest).subscribe({
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

  get typeMouvementClasse(): string {
    return this.typeMouvementCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get dateMouvementClasse(): string {
    return this.dateMouvementCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get montantClasse(): string {
    return this.montantCtrl.valid ? 'is-valid' : 'is-invalid';
  }

  get libelleClasse(): string {
    return this.libelleCtrl.valid ? 'is-valid' : 'is-invalid';
  }
}
