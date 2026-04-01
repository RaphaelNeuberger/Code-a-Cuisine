import { Component, input, output } from '@angular/core';

/** Selectable pill tag used for cuisine, diet, and time filters */
@Component({
  selector: 'app-tag',
  standalone: true,
  templateUrl: './tag.html',
  styleUrl: './tag.scss'
})
export class Tag {
  readonly label = input.required<string>();
  readonly selected = input<boolean>(false);
  readonly tagClick = output<void>();
}
