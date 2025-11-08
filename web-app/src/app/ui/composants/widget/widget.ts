import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-widget',
  imports: [DecimalPipe, UpperCasePipe],
  templateUrl: './widget.html',
  styleUrl: './widget.scss',
})
export class Widget {
  @Input()
  label!: string;
  @Input()
  value!: number;
  @Input()
  inverse: number = 1;
  @Input()
  showDevice: boolean = true;

  get bgColor(): string {
    return this.value * this.inverse < 0
      ? 'bg-danger'
      : this.value === 0
      ? 'bg-secondary'
      : 'bg-success';
  }

  get color(): string {
    return this.value * this.inverse === 0 ? 'text-black' : 'text-white';
  }
}
