import { AuthService } from './../../../../core/services/auth.service';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordRequest } from '../../../../core/models/change-password-request';
import { Observable, tap } from 'rxjs';
import { UserInfos } from '../../../../core/models/user-infos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChangePasswordComponent implements OnInit {
  userInfos$!: Observable<UserInfos>;
  id: number = 0;
  mainForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userInfos$ = this.authService.userInfos$.pipe(
      tap((infos) => {
        this.id = infos.id!;
      })
    );
    this.userInfos$.subscribe();
    this.initForm();
  }

  onCancel(): void {
    this.router.navigateByUrl('/home/profile');
  }

  submitForm(): void {
    if (this.mainForm.valid) {
      this.changePassword(this.mainForm.value);
    }
  }

  changePassword(request: ChangePasswordRequest): void {
    if (this.id) {
      this.authService.changePassword(this.id, request).subscribe({
        next: () => {
          this.toastr.success('Password change successful!', 'Succès');
          this.onCancel(); // Redirect to profile page after successful change
        },
        error: () => {
          this.toastr.error(
            'Change password failed. Please check your credentials.',
            'Erreur'
          );
        },
      });
    }
  }

  initForm(): void {
    this.mainForm = this.fb.group(
      {
        ancienMotDePasse: ['', [Validators.required]],
        motDePasse: ['', [Validators.required]],
        confirmMotDePasse: ['', [Validators.required]],
      },
      {
        validators: [
          this.passwordMatchValidator,
          this.passwordNotMatchValidator,
        ],
      }
    );
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('motDePasse')?.value;
    const confirmPassword = control.get('confirmMotDePasse')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordsNotMatch: true }
      : null;
  }

  passwordNotMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('ancienMotDePasse')?.value;
    const confirmPassword = control.get('motDePasse')?.value;
    return password && confirmPassword && password == confirmPassword
      ? { passwordsMatch: true }
      : null;
  }
}
