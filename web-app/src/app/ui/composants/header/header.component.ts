import { SearchService } from './../../../core/services/search.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  searchCtrl!: FormControl;
  search$!: Observable<string>;
  dateCtrl!: FormControl;
  date$!: Observable<string>;

  constructor(private searchService: SearchService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.onErase();
  }

  private initControls(): void {
    this.searchCtrl = this.fb.control('');
    this.dateCtrl = this.fb.control('');
  }

  private initObservables(): void {}

  onFilter(): void {
    this.searchService.setSearch(this.searchCtrl.value);
    this.searchService.setDate(this.dateCtrl.value.substr(0, 7));
  }

  onErase(): void {
    this.initControls();
    this.onFilter();
  }
}
