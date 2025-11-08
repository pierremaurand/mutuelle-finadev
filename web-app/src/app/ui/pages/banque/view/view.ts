import { Component, OnInit } from '@angular/core';
import { BanqueService } from '../../../../core/services/banque.service';
import { Router, RouterOutlet } from '@angular/router';
import { Banque } from '../../../../core/models/banque';
import { Observable } from 'rxjs';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Card } from '../card/card';

@Component({
  selector: 'app-view',
  imports: [AsyncPipe, Card, RouterOutlet, DecimalPipe],
  templateUrl: './view.html',
  styleUrl: './view.scss',
})
export default class View implements OnInit {
  banque$!: Observable<Banque>;
  id!: number;

  constructor(private banqueService: BanqueService, private router: Router) {}

  ngOnInit(): void {
    this.banque$ = this.banqueService.banque$;
    this.banque$.subscribe();
  }

  onBack(): void {
    this.router.navigateByUrl('/banque');
  }
}
