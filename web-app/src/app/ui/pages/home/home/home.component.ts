import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MembreService } from '../../../../core/services/membre.service';

import { combineLatest, map, Observable, tap } from 'rxjs';
import { Membre } from '../../../../core/models/membre';
import { LineChart } from '../../../composants/line-chart/line-chart';
import { PieChart } from '../../../composants/pie-chart/pie-chart';
import { Widget } from '../../../composants/widget/widget';
import { PieChartData } from '../../../../core/models/pie-chart-data';
import { Mouvement } from '../../../../core/models/mouvement';
import { MouvementService } from '../../../../core/services/mouvement.service';

@Component({
  selector: 'app-home',
  imports: [LineChart, PieChart, Widget],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent implements OnInit {
  membres$!: Observable<Membre[]>;
  labelMembres: string = 'Membres actifs';
  totalMembres: number = 0;

  cotisations$!: Observable<Mouvement[]>;
  labelCotisations: string = 'Encours Cotisations';
  encourCotisations: number = 0;

  avances$!: Observable<Mouvement[]>;
  labelAvances: string = 'Encours Avances';
  encoursAvances: number = 0;

  credits$!: Observable<any>;
  decaissementCredit$!: Observable<Mouvement[]>;
  remboursementsCredits$!: Observable<Mouvement[]>;
  montantDecaisse: number = 0;
  montantRembourse: number = 0;
  labelCredits: string = 'Encours Crédits';
  encoursCredits: number = 0;

  accueil$!: Observable<any>;

  pieChartData: any;

  encoursCotisationData = {
    label: 'Encours cotisations',
    data: [
      0, 10000, 5000, 15000, 20000, 10000, 30000, 35000, 40000, 45000, 50000,
      10000,
    ],
    borderColor: '#FF5733',
    backgroundColor: '#FF5733',
    fill: false,
    tension: 0.1,
    pointRadius: 5,
    pointHoverRadius: 7,
  };

  encoursAvanceData = {
    label: 'Encours avances',
    data: [
      0, 10000, 5000, 15000, 1000, 25000, 30000, 35000, 40000, 25000, 50000,
      55000,
    ],
    borderColor: '#33FF57',
    backgroundColor: '#33FF57',
    fill: false,
    tension: 0.1,
    pointRadius: 5,
    pointHoverRadius: 7,
  };

  encoursCreditData = {
    label: 'Encours crédits',
    data: [
      0, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000,
      55000,
    ],
    borderColor: '#3357FF',
    backgroundColor: '#3357FF',
    fill: false,
    tension: 0.1,
    pointRadius: 5,
    pointHoverRadius: 7,
  };

  dataGraph2: any = {
    labels: ['Homme', 'Femme'],
    datasets: [
      {
        data: [300, 500],
      },
    ],
  };

  dataGraph3: any = {};

  dataGraph4: any = {};

  dataGraph1: any = {
    labels: [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ],
    datasets: [
      this.encoursCotisationData,
      this.encoursAvanceData,
      this.encoursCreditData,
    ],
  };

  constructor(
    private membreService: MembreService,
    private mouvementService: MouvementService
  ) {}

  ngOnInit(): void {
    this.initObservables();
  }

  initObservables(): void {
    this.membres$ = this.membreService.membres$.pipe(
      map((membres) => membres.filter((x) => x.estActif))
    );
    this.membres$.subscribe((membres) => (this.totalMembres = membres.length));
    this.membreService.getAllMembresFromServer();

    this.cotisations$ = this.mouvementService.mouvements$.pipe(
      map((mouvements) => mouvements.filter((x) => x.cotisationId))
    );
    this.cotisations$.subscribe(
      (cotisations) =>
        (this.encourCotisations = cotisations.reduce((total, cotisation) => {
          return total + cotisation.montantCredit;
        }, 0))
    );

    this.avances$ = this.mouvementService.mouvements$.pipe(
      map((mouvements) => mouvements.filter((x) => x.avanceId))
    );
    this.avances$.subscribe(
      (avances) =>
        (this.encoursAvances = avances.reduce((total, avance) => {
          return total + avance.montantDebit - avance.montantCredit;
        }, 0))
    );

    this.decaissementCredit$ = this.mouvementService.mouvements$.pipe(
      map((mouvements) =>
        mouvements.filter((x) => x.creditId && x.montantCredit == 0)
      )
    );
    this.remboursementsCredits$ = this.mouvementService.mouvements$.pipe(
      map((mouvements) =>
        mouvements.filter((x) => x.creditId && x.montantDebit == 0)
      )
    );

    this.credits$ = combineLatest([
      this.decaissementCredit$,
      this.remboursementsCredits$,
    ]).pipe(
      tap(([decaissements, remboursements]) => {
        this.montantDecaisse = decaissements.reduce((total, credit) => {
          return total + credit.montantDebit;
        }, 0);
        this.montantRembourse = remboursements.reduce((total, credit) => {
          return total + credit.montantCapital;
        }, 0);

        this.encoursCredits = this.montantDecaisse - this.montantRembourse;
      })
    );

    this.credits$.subscribe();

    this.mouvementService.getAllMouvementsFromServer();

    this.accueil$ = combineLatest([
      this.cotisations$,
      this.avances$,
      this.credits$,
    ]);

    this.accueil$.subscribe(() => {
      this.initPieChartData();
    });
  }

  initPieChartData(): void {
    this.pieChartData = new PieChartData();
    this.pieChartData.labels = [
      this.labelCotisations,
      this.labelAvances,
      this.labelCredits,
    ];
    this.pieChartData.datasets = [
      {
        data: [
          this.encourCotisations,
          this.encoursAvances,
          this.encoursCredits,
        ],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ];
  }
}
