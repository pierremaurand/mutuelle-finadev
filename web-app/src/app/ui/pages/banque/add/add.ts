import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Banque } from '../../../../core/models/banque';
import { BanqueService } from '../../../../core/services/banque.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Card } from '../../banque/card/card';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule, Card],
  templateUrl: './add.html',
  styleUrl: './add.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddComponent implements OnInit {
  request!: FormGroup;
  banque$!: Observable<Banque>;
  id!: number;

  constructor(
    private router: Router,
    private banqueService: BanqueService,
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
    this.banque$ = this.banqueService.banque$;
    this.banque$.subscribe({
      next: (banque: Banque) => {
        this.id = banque.id as number;
        this.request.patchValue({
          nom: banque.nom as string,
        });
      },
    });
  }

  submitForm(): void {
    if (this.request.valid) {
      this.banqueService.addOrUpdate(this.id, this.request.value).subscribe({
        next: () => {
          this.toastr.success("L'enregistrement a réussie!", 'Succès');
          this.banqueService.getAllBanquesFromServer();
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
    this.router.navigateByUrl('/banque');
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
