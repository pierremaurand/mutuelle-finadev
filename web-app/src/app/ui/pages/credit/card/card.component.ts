import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Credit } from '../../../../core/models/credit';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { Membre } from '../../../../core/models/membre';

@Component({
  selector: 'app-card',
  imports: [UpperCasePipe, DecimalPipe, DatePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input()
  credit!: Credit;
  @Input()
  membre!: Membre;
  baseUrl: string = environment.imagesUrl;

  constructor(private router: Router) {}

  onEdit(): void {}

  onView(): void {
    this.router.navigateByUrl('/credit/view/' + this.credit.id);
  }
}
