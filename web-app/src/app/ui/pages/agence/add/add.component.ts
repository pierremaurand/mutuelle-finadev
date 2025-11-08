import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Agence } from '../../../../core/models/agence';
import { AgenceService } from '../../../../core/services/agence.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Card } from '../../banque/card/card';
import { AgenceCardComponent } from '../agence-card/agence-card.component';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule, CommonModule, AgenceCardComponent],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddComponent implements OnInit {
  request!: FormGroup;
  agence$!: Observable<Agence>;
  id!: number;

  constructor(
    private router: Router,
    private agenceService: AgenceService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initObservables();
  }

  initForm(): void {
    this.request = this.fb.group({
      nom: ['', [Validators.required]],
    });
  }

  initObservables(): void {
    this.agence$ = this.agenceService.agence$;
    this.agence$.subscribe({
      next: (agence: Agence) => {
        this.id = agence.id as number;
        this.request.patchValue({
          nom: agence.nom as string,
        });
      },
    });
  }

  submitForm(): void {
    if (this.request.valid) {
      this.agenceService.addOrUpdate(this.id, this.request.value).subscribe({
        next: () => {
          this.toastr.success("L'enregistrement a réussie!", 'Succès');
          this.agenceService.getAllAgencesFromServer();
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
    this.router.navigateByUrl('/agence');
  }

  private afficheErreur(error: any): string {
    console.log(error.errors[0]);
    if (error.errors) {
      return error.errors[0] || 'Une erreur est survenue!';
    } else {
      return 'Une erreur est survenue!';
    }
  }

  get nomClass(): string {
    if (this.request.get('nom')?.touched) {
      return this.request.get('nom')?.valid ? 'is-valid' : 'is-invalid';
    } else {
      return '';
    }
  }
}
