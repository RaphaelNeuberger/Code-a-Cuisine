import { Component, HostBinding, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { Nav } from './shared/components/nav/nav';

/** Root application component — renders logo header + routed page + footer */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, Nav],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);

  readonly isResultsPage = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects === '/recipe-suggestions')
    ),
    { initialValue: this.router.url === '/recipe-suggestions' }
  );

  readonly showImprint = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => {
        const url = (e as NavigationEnd).urlAfterRedirects;
        const isHero = url === '/ingredients' && !url.includes('step=2');
        return !isHero && !url.startsWith('/imprint');
      })
    ),
    {
      initialValue: (() => {
        const url = this.router.url;
        const isHero = url === '/ingredients' && !url.includes('step=2');
        return !isHero && !url.startsWith('/imprint');
      })()
    }
  );

  readonly isPreferencesPage = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects.includes('step=2'))
    ),
    { initialValue: this.router.url.includes('step=2') }
  );

  @HostBinding('class.page--results') get resultsPage(): boolean {
    return this.isResultsPage() ?? false;
  }

  @HostBinding('class.page--preferences') get preferencesPage(): boolean {
    return this.isPreferencesPage() ?? false;
  }
}
