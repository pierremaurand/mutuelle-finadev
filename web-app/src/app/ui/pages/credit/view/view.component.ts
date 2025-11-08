import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Credit } from '../../../../core/models/credit';
import { Observable } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { CreditService } from '../../../../core/services/credit.service';
import { Router, RouterOutlet } from '@angular/router';
import { Membre } from '../../../../core/models/membre';
import { MembreCardComponent } from '../../membre/membre-card/membre-card.component';

@Component({
  selector: 'app-view',
  imports: [CommonModule, RouterOutlet, MembreCardComponent],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ViewComponent implements OnInit {
  credit$!: Observable<Credit>;
  membre$!: Observable<Membre>;
  creditSolder: boolean = false;
  photo: SafeUrl = './assets/images/default_man.jpg';
  baseUrl: string = environment.imagesUrl;

  constructor(private creditService: CreditService, private router: Router) {}

  ngOnInit(): void {
    this.credit$ = this.creditService.credit$;
  }

  onAnticipePaiement(id: number): void {
    this.router.navigateByUrl('/credit/view/' + id + '/paiement');
  }

  onBack(): void {
    this.router.navigateByUrl('/credit');
  }
}
