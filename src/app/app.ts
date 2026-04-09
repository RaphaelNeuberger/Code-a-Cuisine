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

  @HostBinding('class.page--results') get resultsPage(): boolean {
    return this.isResultsPage() ?? false;
  }
}
