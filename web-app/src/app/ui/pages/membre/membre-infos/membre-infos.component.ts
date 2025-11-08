import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MembreService } from '../../../../core/services/membre.service';
import { CotisationService } from '../../../../core/services/cotisation.service';
import { AvanceService } from '../../../../core/services/avance.service';
import { CreditService } from '../../../../core/services/credit.service';
import { combineLatest, map, Observable, tap } from 'rxjs';
import { Membre } from '../../../../core/models/membre';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Cotisation } from '../../../../core/models/cotisation';
import { Avance } from '../../../../core/models/avance';
import { Credit } from '../../../../core/models/credit';
import { Widget } from '../../../composants/widget/widget';
import { LignePret } from '../../../composants/ligne-pret/ligne-pret';
import { Router } from '@angular/router';
import { SortPipe } from '../../../../core/pipes/sort.pipe';
import { PieChartData } from '../../../../core/models/pie-chart-data';
import { PieChart } from '../../../composants/pie-chart/pie-chart';

@Component({
  selector: 'app-membre-infos',
  imports: [CommonModule, AsyncPipe, Widget, LignePret, SortPipe, PieChart],
  templateUrl: './membre-infos.component.html',
  styleUrl: './membre-infos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MembreInfosComponent implements OnInit {
  membre$!: Observable<Membre>;
  membre!: Membre;
  membreId!: number;
  cotisations$!: Observable<Cotisation[]>;
  cotisations!: Cotisation[];
  avances$!: Observable<Avance[]>;
  avances!: Avance[];
  credits$!: Observable<Credit[]>;
  credits!: Credit[];

  labelAdhesion: string = 'Adhésion';
  labelCredits: string = 'Crédits';
  labelAvances: string = 'Avances';
  labelCotisations: string = 'Cotisations';

  chartData: any;

  constructor(
    private membreService: MembreService,
    private cotisationService: CotisationService,
    private avanceService: AvanceService,
    private creditService: CreditService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initObservable();
  }

  initObservable(): void {
    // Initialize observables here if needed
    this.membre$ = this.membreService.membre$.pipe(
      tap((membre: Membre) => (this.membre = membre))
    );

    this.cotisations$ = combineLatest([
      this.membre$,
      this.cotisationService.cotisations$,
    ]).pipe(
      map(([membre, cotisations]) =>
        cotisations.filter((cotisation) => cotisation.membreId === membre.id)
      )
    );

    this.avances$ = combineLatest([
      this.membre$,
      this.avanceService.avances$,
    ]).pipe(
      map(([membre, avances]) =>
        avances.filter((avance) => avance.membreId === membre.id)
      )
    );

    this.credits$ = combineLatest([
      this.membre$,
      this.creditService.credits$,
    ]).pipe(
      map(([membre, credits]) =>
        credits.filter((credit) => credit.membreId === membre.id)
      )
    );

    this.cotisations$.subscribe({
      next: (cotisations) => (this.cotisations = cotisations),
    });
    this.avances$.subscribe({
      next: (avances) => (this.avances = avances),
    });
    this.credits$.subscribe({
      next: (credits) => (this.credits = credits),
    });

    this.membre$.subscribe({
      next: (membre) => {
        if (membre) {
          this.membreId = membre.id ?? 0;
          this.initChartData();
        }
      },
      error: (err) => {
        console.error('Error fetching membre:', err);
      },
    });
  }

  get soldeCotisations(): number {
    return this.cotisations.reduce((sum, x) => sum + (x.retenue ?? 0), 0) ?? 0;
  }

  get soldeAvances(): number {
    return (
      this.avances.reduce(
        (sum, x) => sum + (x.montantCapitalRestant ?? 0),
        0
      ) ?? 0
    );
  }

  get soldeCredits(): number {
    return (
      this.credits.reduce(
        (sum, x) => sum + (x.montantCapitalRestant ?? 0),
        0
      ) ?? 0
    );
  }

  onSelectedAvance(avance: Avance): void {
    this.router.navigateByUrl(
      '/membre/view/' + this.membreId + '/avance/' + avance.id
    );
  }

  onSelectedCredit(credit: Credit): void {
    this.router.navigateByUrl(
      '/membre/view/' + this.membreId + '/credit/' + credit.id
    );
  }

  initChartData(): void {
    this.chartData = new PieChartData();
    this.chartData.labels = [
      this.labelAdhesion,
      this.labelCotisations,
      this.labelAvances,
      this.labelCredits,
    ];
    this.chartData.datasets = [
      {
        data: [
          this.membre.encourAdhesion,
          this.membre.encourCotisation,
          this.membre.encourAvance,
          this.membre.encourCredit,
        ],
        backgroundColor: ['#36eb63ff', '#36A2EB', '#FF6384', '#FFCE56'],
      },
    ];
  }
}
