import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../ui/composants/header/header.component';
import { SideBarComponent } from '../../../ui/composants/side-bar/side-bar.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, HeaderComponent, SideBarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export default class LayoutComponent {}
