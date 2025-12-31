import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CardMouvement } from '../card-mouvement/card-mouvement';
import { MouvementService } from '../../../../core/services/mouvement.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CaisseService } from '../../../../core/services/caisse.service';
import { Observable } from 'rxjs';
import { Caisse } from '../../../../core/models/caisse';
import { Mouvement } from '../../../../core/models/mouvement';

@Component({
  selector: 'app-entree-caisse',
  imports: [ReactiveFormsModule, CardMouvement],
  templateUrl: './entree-caisse.html',
  styleUrl: './entree-caisse.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EntreeCaisse {
  request!: FormGroup;
  caisseId!: number;
  caisse$!: Observable<Caisse>;
  caisse!: Caisse;
  private mouvementService = inject(MouvementService);
  private caisseService = inject(CaisseService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  @Input()
  set id(value: number) {
    this.caisse$ = this.caisseService.caisse$;
    this.caisseId = value;
    this.caisse$.subscribe((caisse: Caisse) => (this.caisse = caisse));
    this.caisseService.getCaisseFromServer(value);
    this.initForm();
  }

  get id(): number {
    return this.caisseId;
  }

  initForm(): void {
    this.request = this.fb.group({
      montantCredit: ['', Validators.required],
      libelle: ['', Validators.required],
      dateMouvement: [this.caisse.dateCaisse, Validators.required],
      caisseId: [this.caisse.id, Validators.required],
    });
  }

  submitForm(): void {
    if (this.request.valid) {
      this.mouvementService.add(this.request.value as Mouvement).subscribe({
        next: () => {
          this.toastr.success("L'enregistrement a réussie!", 'Succès');
          this.caisseService.getCaisseFromServer(this.id);
          this.onCancel();
        },
        error: (error) => {
          console.log(error);
          if (error.status === 400) {
            this.toastr.error('', 'Erreur de validation');
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
    this.router.navigateByUrl('/caisse/view/' + this.id);
  }

  get montantClass(): string {
    return this.request.get('montantCredit')?.valid ? 'is-valid' : 'is-invalid';
  }

  get libelleClass(): string {
    return this.request.get('libelle')?.valid ? 'is-valid' : 'is-invalid';
  }
}
