import { Component, HostBinding, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

/** Top navigation bar with logo and main links */
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.scss'
})
export class Nav {
  private readonly router = inject(Router);
  menuOpen = false;

  readonly isHeroPage = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => {
        const url = (e as NavigationEnd).urlAfterRedirects;
        return url === '/ingredients' && !url.includes('step=2');
      })
    ),
    { initialValue: (this.router.url === '/ingredients' && !this.router.url.includes('step=2')) || this.router.url === '/' }
  );

  readonly isResultsPage = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects === '/recipe-suggestions')
    ),
    { initialValue: this.router.url === '/recipe-suggestions' }
  );

  get logoSrc(): string {
    return (this.isHeroPage() || this.isResultsPage()) ? 'assets/logo_white.svg' : 'assets/logo_green.svg';
  }

  @HostBinding('class.nav--hero') get heroMode(): boolean {
    return this.isHeroPage() ?? true;
  }

  @HostBinding('class.nav--results') get resultsMode(): boolean {
    return this.isResultsPage() ?? false;
  }
}
