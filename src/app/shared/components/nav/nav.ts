import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/** Top navigation bar with logo and main links */
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss'
})
export class Nav {
  menuOpen = false;
}
