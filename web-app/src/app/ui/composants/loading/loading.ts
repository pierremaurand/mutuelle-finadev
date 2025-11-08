import { Observable } from 'rxjs';
import { LoadingService } from './../../../core/services/loading.service';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Loading implements OnInit {
  private loadingService = inject(LoadingService);
  loading$!: Observable<boolean>;

  ngOnInit(): void {
    this.initObservables();
  }

  private initObservables(): void {
    this.loading$ = this.loadingService.loading$;
  }
}
