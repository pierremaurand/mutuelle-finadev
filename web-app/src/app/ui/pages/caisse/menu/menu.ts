import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserInfos } from '../../../../core/models/user-infos';
import { Caisse } from '../../../../core/models/caisse';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  @Input()
  caisse!: Caisse;

  @Input()
  user!: UserInfos;
}
