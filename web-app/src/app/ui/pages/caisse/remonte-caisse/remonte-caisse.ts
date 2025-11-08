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
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CaisseService } from '../../../../core/services/caisse.service';
import { Observable, tap } from 'rxjs';
import { Caisse } from '../../../../core/models/caisse';
import { Mouvement } from '../../../../core/models/mouvement';
import { Banque } from '../../../../core/models/banque';
import { BanqueService } from '../../../../core/services/banque.service';

@Component({
  selector: 'app-remonte-caisse',
  imports: [ReactiveFormsModule, CommonModule, CardMouvement],
  templateUrl: './remonte-caisse.html',
  styleUrl: './remonte-caisse.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RemonteCaisse {
  request!: FormGroup;
  caisseId!: number;
  caisse$!: Observable<Caisse>;
  caisse!: Caisse;
  banques$!: Observable<Banque[]>;
  banques: Banque[] = [];
  libelle: string = '';
  private mouvementService = inject(MouvementService);
  private caisseService = inject(CaisseService);
  private banqueService = inject(BanqueService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  @Input()
  set id(value: number) {
    this.caisse$ = this.caisseService.caisse$;
    this.caisseId = value;
    this.caisse$.subscribe((caisse: Caisse) => (this.caisse = caisse));
    this.caisseService.getCaisseFromServer(value);
    this.banques$ = this.banqueService.banques$;
    this.banqueService.getAllBanquesFromServer();
    this.banques$.subscribe((banques) => (this.banques = banques));
    this.initForm();
  }

  get id(): number {
    return this.caisseId;
  }

  initForm(): void {
    this.libelle = '';
    this.request = this.fb.group({
      montantDebit: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.max(this.caisse.solde ?? 0),
        ],
      ],
      libelle: [this.libelle, Validators.required],
      dateMouvement: [this.caisse.dateCaisse, Validators.required],
      caisseId: [this.caisse.id, Validators.required],
      banqueId: ['', Validators.required],
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

  onBanqueChange($event: any): void {
    const id = $event.target.value;
    this.libelle = '';
    const banque = this.banques.find((x) => x.id === +id);
    if (banque) this.libelle = 'Dépôt à la banque ' + banque.nom;
    this.request.get('libelle')?.setValue(this.libelle);
  }

  get banqueClass(): string {
    return this.request.get('banqueId')?.valid ? 'is-valid' : 'is-invalid';
  }

  get montantClass(): string {
    return this.request.get('montantDebit')?.valid ? 'is-valid' : 'is-invalid';
  }
}
