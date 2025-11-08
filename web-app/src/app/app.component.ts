import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loading } from './ui/composants/loading/loading';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loading],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'mutuelleApp';
}
