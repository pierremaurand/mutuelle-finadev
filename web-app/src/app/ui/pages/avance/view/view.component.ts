import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Avance } from '../../../../core/models/avance';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AvanceService } from '../../../../core/services/avance.service';
import { Router, RouterOutlet } from '@angular/router';
import { MembreCardComponent } from '../../membre/membre-card/membre-card.component';

@Component({
  selector: 'app-view',
  imports: [CommonModule, RouterOutlet, MembreCardComponent],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ViewComponent implements OnInit {
  avance$!: Observable<Avance>;
  avance: Avance = new Avance();

  constructor(private avanceService: AvanceService, private router: Router) {}

  ngOnInit(): void {
    this.initObservables();
  }

  initObservables(): void {
    this.avance$ = this.avanceService.avance$;
    this.avance$.subscribe({
      next: (avance) => {
        this.avance = avance;
      },
      error: (err) => {
        console.error('Error fetching avance:', err);
      },
    });
  }

  onAnticipePaiement(id: number): void {
    this.router.navigateByUrl('/avance/view/' + id + '/paiement');
  }

  onBack(): void {
    this.router.navigateByUrl('/avance');
  }
}
