import { Component, Input } from '@angular/core';
import { Adhesion } from '../../../../core/models/adhesion';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-card',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input()
  adhesion!: Adhesion;
  baseUrl: string = environment.imagesUrl;

  constructor(private router: Router) {}

  onEdit(): void {}

  onView(): void {}
}
