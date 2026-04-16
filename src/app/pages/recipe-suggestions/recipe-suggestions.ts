import { Component, OnInit, inject, signal, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { from, catchError, of, switchMap, map, timeout } from 'rxjs';
import { RecipeStateService } from '../../shared/services/recipe-state.service';
import { N8nService } from '../../shared/services/n8n.service';
import { RecipeService } from '../../shared/services/recipe.service';
import { Loading } from '../../shared/components/loading/loading';
import { RecipeCard } from '../../shared/components/recipe-card/recipe-card';
import { Recipe } from '../../shared/models/recipe.model';

/** Shows loading state during generation, then displays 3 recipe results */
@Component({
  selector: 'app-recipe-suggestions',
  standalone: true,
  imports: [Loading, RecipeCard, RouterLink],
  templateUrl: './recipe-suggestions.html',
  styleUrl: './recipe-suggestions.scss'
})
export class RecipeSuggestions implements OnInit {
  private readonly state = inject(RecipeStateService);
  private readonly n8n = inject(N8nService);
  private readonly recipeService = inject(RecipeService);
  private readonly router = inject(Router);
  private readonly injector = inject(EnvironmentInjector);

  readonly recipes = signal<Recipe[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly isQuotaError = signal<boolean>(false);

  /** On init, use cached recipes if available, otherwise generate */
  ngOnInit(): void {
    const request = this.state.request();
    if (!request) {
      this.router.navigate(['/ingredients']);
      return;
    }

    const cached = this.state.recipes();
    if (cached.length > 0) {
      this.state.setIngredients([]);
      this.recipes.set(cached);
      this.isLoading.set(false);
      return;
    }

    this.generateRecipes();
  }

  /** Calls n8n, saves to Firestore, stores results in state */
  private generateRecipes(): void {
    const request = this.state.request()!;
    this.n8n.generateRecipes(request).pipe(
      switchMap(recipes =>
        from(runInInjectionContext(this.injector, () => this.recipeService.saveRecipes(recipes))).pipe(
          timeout(8000),
          map(ids => recipes.map((r, i) => ({ ...r, id: ids[i] }))),
          catchError(() => of(recipes))
        )
      )
    ).subscribe({
      next: (recipes) => {
        this.state.setRecipes(recipes);
        this.state.setIngredients([]);
        this.recipes.set(recipes);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        if ((err as any)['quota']) {
          this.isQuotaError.set(true);
        } else {
          this.error.set(err.message);
        }
        this.isLoading.set(false);
      }
    });
  }

  /** Returns the selected cuisine preference for display. */
  get cuisineTag(): string {
    return this.state.request()?.cuisine ?? '';
  }

  /** Returns the selected complexity preference for display. */
  get complexityTag(): string {
    return this.state.request()?.complexity ?? '';
  }
}
