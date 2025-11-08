import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Agence } from '../../../../core/models/agence';
import { AgenceService } from '../../../../core/services/agence.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AgenceCardComponent } from '../agence-card/agence-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view',
  imports: [CommonModule, AsyncPipe, AgenceCardComponent],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ViewComponent implements OnInit {
  agence$!: Observable<Agence>;
  id!: number;

  constructor(private agenceService: AgenceService, private router: Router) {}

  ngOnInit(): void {
    this.agence$ = this.agenceService.agence$;
    this.agence$.subscribe();
  }

  onBack(): void {
    this.router.navigateByUrl('/agence');
  }
}
