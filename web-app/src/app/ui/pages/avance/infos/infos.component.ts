import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EcheancierPretComponent } from '../../../composants/echeancier-pret/echeancier-pret.component';
import { combineLatest, map, Observable, tap } from 'rxjs';
import { Avance } from '../../../../core/models/avance';
import { AvanceService } from '../../../../core/services/avance.service';
import { EcheanceService } from '../../../../core/services/echeance.service';
import { Echeance } from '../../../../core/models/echeance';
import { PieChart } from '../../../composants/pie-chart/pie-chart';
import { ActivatedRoute, Router } from '@angular/router';
import { PieChartData } from '../../../../core/models/pie-chart-data';

@Component({
  selector: 'app-infos',
  imports: [CommonModule, EcheancierPretComponent, PieChart],
  templateUrl: './infos.component.html',
  styleUrl: './infos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InfosComponent implements OnInit {
  avance$!: Observable<Avance>;
  echeancier$!: Observable<Echeance[]>;
  montantPaye: number = 0;
  montantRestant: number = 0;
  origin: string = '';
  membreId!: number;

  chartData: any;

  constructor(
    private avanceService: AvanceService,
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
    this.avance$ = this.avanceService.avance$.pipe(
      tap((avance) => {
        if (avance) {
          this.membreId = avance.membreId ?? 0;
          this.initChartData(
            (avance.montantCapital ?? 0) - (avance.montantCapitalRestant ?? 0),
            avance.montantCapitalRestant ?? 0
          );
        }
      })
    );

    this.echeancier$ = combineLatest([
      this.avanceService.avance$,
      this.echeanceService.echeances$,
    ]).pipe(
      map(([avance, echeances]) => {
        return echeances.filter((e) => e.avanceId === avance.id);
      })
    );
  }

  onBack() {
    this.router.navigateByUrl('/membre/view/' + this.membreId + '/infos');
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
}
