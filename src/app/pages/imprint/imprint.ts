import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';

/** Static imprint / legal notice page */
@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [],
  templateUrl: './imprint.html',
  styleUrl: './imprint.scss'
})
export class Imprint {
  private readonly location = inject(Location);

  back(): void {
    this.location.back();
  }
}
