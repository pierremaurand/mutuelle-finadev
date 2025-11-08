import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EcheancierPretComponent } from '../../../composants/echeancier-pret/echeancier-pret.component';
import { combineLatest, map, Observable, tap } from 'rxjs';
import { Credit } from '../../../../core/models/credit';
import { CreditService } from '../../../../core/services/credit.service';
import { EcheanceService } from '../../../../core/services/echeance.service';
import { Echeance } from '../../../../core/models/echeance';
import { ActivatedRoute, Router } from '@angular/router';
import { PieChart } from '../../../composants/pie-chart/pie-chart';
import { PieChartData } from '../../../../core/models/pie-chart-data';

@Component({
  selector: 'app-infos',
  imports: [CommonModule, EcheancierPretComponent, PieChart],
  templateUrl: './infos.component.html',
  styleUrl: './infos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InfosComponent implements OnInit {
  credit$!: Observable<Credit>;
  echeancier$!: Observable<Echeance[]>;
  origin: string = '';
  membreId!: number;

  chartData: any;

  constructor(
    private creditService: CreditService,
    private echeanceService: EcheanceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initObservables();
    this.route.data.subscribe((data) => {
      this.origin = data['origin'];
    });
  }

  initObservables(): void {
    this.credit$ = this.creditService.credit$.pipe(
      tap((credit) => {
        if (credit) {
          this.membreId = credit.membreId ?? 0;
          this.initChartData(
            (credit.montantTotal ?? 0) - (credit.montantCapitalRestant ?? 0),
            credit.montantCapitalRestant ?? 0
          );
        }
      })
    );
    this.echeancier$ = combineLatest([
      this.creditService.credit$,
      this.echeanceService.echeances$,
    ]).pipe(
      map(([credit, echeances]) => {
        return echeances.filter((e) => e.creditId === credit.id);
      })
    );
  }

  initChartData(montantPaye: number, montantRestant: number): void {
    this.chartData = new PieChartData();
    this.chartData.labels = ['Montant payé', 'Montant restant'];
    this.chartData.datasets = [
      {
        data: [montantPaye, montantRestant],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ];
  }

  onBack() {
    this.router.navigateByUrl('/membre/view/' + this.membreId + '/infos');
  }
}
