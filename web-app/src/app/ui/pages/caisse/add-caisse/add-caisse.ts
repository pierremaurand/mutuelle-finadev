import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { combineLatest, map, Observable, startWith, tap } from 'rxjs';
import { Caisse } from '../../../../core/models/caisse';
import { CaisseService } from '../../../../core/services/caisse.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { CardCaisse } from '../card-caisse/card-caisse';
import { UtilisateurService } from '../../../../core/services/utilisateur.service';
import { Utilisateur } from '../../../../core/models/utilisateur';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule, CommonModule, CardCaisse],
  templateUrl: './add-caisse.html',
  styleUrl: './add-caisse.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddCaisse implements OnInit {
  request!: FormGroup;
  caisse$!: Observable<Caisse>;
  caisses$!: Observable<Caisse[]>;
  utilisateurs$!: Observable<Utilisateur[]>;
  utilisateurs: Utilisateur[] = [];
  utilisateurIdCtrl!: FormControl;
  id!: number;

  constructor(
    private router: Router,
    private caisseService: CaisseService,
    private utilisateurService: UtilisateurService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initControls();
    this.initForm();
    this.initObservables();
  }

  initControls(): void {
    this.utilisateurIdCtrl = new FormControl('', Validators.required);
  }

  initForm(): void {
    this.request = this.fb.group({
      agentId: ['', Validators.required],
      dateCaisse: ['', Validators.required],
    });
  }

  initObservables(): void {
    this.caisse$ = this.caisseService.caisse$.pipe(
      tap((caisse: Caisse) => {
        this.id = caisse.id as number;
        this.request.patchValue({
          agentId: caisse.agentId as number,
          dateCaisse: caisse.dateCaisse as string,
        });
      })
    );

    this.caisses$ = this.caisseService.caisses$;

    this.utilisateurs$ = combineLatest([
      this.caisse$,
      this.caisses$,
      this.utilisateurService.utilisateurs$,
    ]).pipe(
      map(([caisse, caisses, utilisateurs]) =>
        utilisateurs.filter(
          (utilisateur) =>
            !caisses.find((x) => x.agentId === utilisateur.id) ||
            (caisse && caisse.id && caisse.agentId === utilisateur.id)
        )
      )
    );
    this.utilisateurs$.subscribe({
      next: (utilisateurs: Utilisateur[]) => {
        this.utilisateurs = utilisateurs;
      },
    });

    this.caisse$.subscribe();
  }

  submitForm(): void {
    if (this.request.valid) {
      console.log(this.request.value);
      this.caisseService.addOrUpdate(this.id, this.request.value).subscribe({
        next: () => {
          this.toastr.success("L'enregistrement a réussie!", 'Succès');
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
    this.router.navigateByUrl('/caisse');
  }

  private afficheErreur(error: any): string {
    console.log(error.errors[0]);
    if (error.errors) {
      return error.errors[0] || 'Une erreur est survenue!';
    } else {
      return 'Une erreur est survenue!';
    }
  }

  get utilisateurClass(): string {
    if (this.request.get('agentId')?.touched) {
      return this.request.get('agentId')?.valid ? 'is-valid' : 'is-invalid';
    } else {
      return '';
    }
  }

  get dateCaisseClass(): string {
    if (this.request.get('dateCaisse')?.touched) {
      return this.request.get('dateCaisse')?.valid ? 'is-valid' : 'is-invalid';
    } else {
      return '';
    }
  }
}
