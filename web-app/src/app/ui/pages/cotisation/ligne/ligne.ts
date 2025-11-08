import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { InfosPret } from '../../../../core/models/infos-pret';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CotisationEvent } from '../../../../core/models/cotisation-event';

@Component({
  selector: 'app-ligne',
  imports: [ReactiveFormsModule, CommonModule, UpperCasePipe],
  templateUrl: './ligne.html',
  styleUrl: './ligne.scss',
})
export class Ligne {
  @Input()
  cotisation!: InfosPret;
  @Output()
  selectedEvent = new EventEmitter<InfosPret>();
  baseUrl: string = environment.imagesUrl;
  @Output()
  salaireChangeEvent = new EventEmitter<CotisationEvent>();

  salaireCtrl!: FormControl;

  constructor() {
    this.salaireCtrl = new FormControl('', {
      validators: [Validators.required, Validators.min(0)],
    });
    this.salaireCtrl.valueChanges.subscribe((value) => {
      let salaireChange = new CotisationEvent();
      salaireChange.membreId = this.cotisation.id ?? 0;
      salaireChange.salaire = value;
      this.salaireChangeEvent.emit(salaireChange);
    });
  }

  onSelected(): void {
    this.selectedEvent.emit(this.cotisation);
  }

  get photo(): string {
    return this.cotisation.nomSexe?.toLowerCase().includes('femme')
      ? './assets/images/default_woman.jpg'
      : './assets/images/default_man.jpg';
  }

  get color(): string {
    return this.cotisation.nomSexe?.toLowerCase().includes('femme')
      ? 'text-danger'
      : 'text-primary';
  }

  get border(): string {
    return this.cotisation.nomSexe?.toLowerCase().includes('femme')
      ? 'border-danger'
      : 'border-primary';
  }

  get sexeIcon(): string {
    return this.cotisation.nomSexe?.toLowerCase().includes('femme')
      ? 'fa-person-dress'
      : 'fa-person';
  }

  get salaireClass(): string {
    return this.salaireCtrl.valid ? 'is-valid' : 'is-invalid';
  }
}
