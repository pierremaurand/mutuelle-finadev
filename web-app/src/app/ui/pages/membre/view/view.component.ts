import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Membre } from '../../../../core/models/membre';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MembreService } from '../../../../core/services/membre.service';
import { Router, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MembreRequest } from '../../../../core/models/membre-request';
import { MembreCardComponent } from '../membre-card/membre-card.component';
import { InfosPret } from '../../../../core/models/infos-pret';

@Component({
  selector: 'app-view',
  imports: [CommonModule, RouterOutlet, AsyncPipe, MembreCardComponent],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ViewComponent implements OnInit {
  membre$!: Observable<Membre>;

  constructor(
    private membreService: MembreService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initObservables();
  }

  initObservables(): void {
    this.membre$ = this.membreService.membre$;
    this.membre$.subscribe();
  }

  activateMember(membre: InfosPret): void {
    membre.estActif = !membre.estActif;
    this.membreService
      .addOrUpdate(membre.id ?? 0, membre as MembreRequest)
      .subscribe({
        next: () => {
          this.toastr.success('Membre mis à jour avec succès', 'Succès');
          this.membreService.getMembreFromServer(membre.id ?? 0);
        },
        error: (err) => {
          this.toastr.error(err, 'Erreur');
        },
      });
  }

  changeImageMember(membre: InfosPret): void {
    this.router.navigateByUrl('/membre/view/' + membre.id + '/image');
  }

  onBack(): void {
    this.router.navigateByUrl('/membre');
  }
}
