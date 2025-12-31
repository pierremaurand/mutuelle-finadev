import { AuthService } from './../../../../core/services/auth.service';
import { UtilisateurService } from './../../../../core/services/utilisateur.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfos } from '../../../../core/models/user-infos';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { Sexe } from '../../../../core/models/sexe';
import { Role } from '../../../../core/models/role';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddComponent implements OnInit {
  request!: FormGroup;
  utilisateur$!: Observable<UserInfos>;

  photo: SafeUrl = './assets/images/default_man.jpg';
  baseUrl: string = environment.imagesUrl;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private utilisateurService: UtilisateurService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initObservables();
  }

  initObservables(): void {
    this.utilisateur$ = this.utilisateurService.utilisateur$.pipe(
      tap((utilisateur: UserInfos) => {
        this.request.patchValue({
          id: utilisateur.id,
          login: utilisateur.login,
          nom: utilisateur.nom,
          sexe: utilisateur.sexe,
          role: utilisateur.role,
        });
        if (utilisateur.photo) {
          this.photo = this.baseUrl + '/' + utilisateur.photo;
        }
      })
    );
    this.utilisateur$.subscribe();
  }

  initForm(): void {
    this.request = this.fb.group({
      id: [0],
      login: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      sexe: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.request.valid) {
      this.utilisateurService
        .addOrUpdateUser(this.request.controls['id'].value, this.request.value)
        .subscribe({
          next: () => {
            this.toastr.success("L'enregistrement a réussie!", 'Succès');
            this.router.navigateByUrl('/utilisateur');
          },
          error: (error) => {
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

  onBack(): void {
    this.router.navigateByUrl('/utilisateur');
  }

  private afficheErreur(error: any): string {
    console.log(error.errors[0]);
    if (error.errors) {
      return error.errors[0] || 'Une erreur est survenue!';
    } else {
      return 'Une erreur est survenue!';
    }
  }
}
