import { Component } from '@angular/core';

/** Full-screen loading overlay shown during recipe generation */
@Component({
  selector: 'app-loading',
  standalone: true,
  templateUrl: './loading.html',
  styleUrl: './loading.scss'
})
export class Loading {}
