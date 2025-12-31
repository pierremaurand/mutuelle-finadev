import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthRequest } from '../../../../core/models/auth-request';
import { Router } from '@angular/router';
import { TokenService } from '../../../../core/token/token.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  authRequest: AuthRequest = { login: '', password: '' };

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  onSubmitForm(form: NgForm): void {
    if (form.invalid) {
      this.toastr.error(
        'Veuillez remplir tous les champs.',
        'Erreur de saisie!'
      );
      return;
    }

    this.authService.login(form.value).subscribe({
      next: (response) => {
        this.toastr.success('Login successful!', 'Succès');
        this.tokenService.token = response.token as string;
        this.authService.getUserInfosFromServer();
        this.router.navigateByUrl('/mef/home');
      },
      error: (error) => {
        this.toastr.error(
          'Des données invalides ont été trouvés dans le formulaire .',
          'Données invalides!'
        );
        console.error('Login error:', error);
      },
    });
  }
}
