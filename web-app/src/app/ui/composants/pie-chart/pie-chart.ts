import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-pie-chart',
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChart {
  @Input() data: any;
}
