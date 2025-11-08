import {
  DecimalPipe,
  CommonModule,
  DatePipe,
  UpperCasePipe,
} from '@angular/common';
import { Mouvement } from './../../../../core/models/mouvement';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-infos',
  imports: [CommonModule, DecimalPipe, DatePipe, UpperCasePipe],
  templateUrl: './infos.html',
  styleUrl: './infos.scss',
})
export class Infos {
  @Input()
  mouvement!: Mouvement;
}
