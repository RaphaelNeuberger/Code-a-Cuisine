import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Static imprint / legal notice page */
@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './imprint.html',
  styleUrl: './imprint.scss'
})
export class Imprint {}
