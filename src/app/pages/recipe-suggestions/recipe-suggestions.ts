import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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

  readonly recipes = signal<Recipe[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  /** On init, trigger recipe generation using the stored request */
  ngOnInit(): void {
    const request = this.state.request();
    if (!request) {
      this.router.navigate(['/ingredients']);
      return;
    }
    this.generateRecipes();
  }

  /** Calls n8n, saves to Firestore, stores results in state */
  private generateRecipes(): void {
    const request = this.state.request()!;
    this.n8n.generateRecipes(request).subscribe({
      next: async (recipes) => {
        const ids = await this.recipeService.saveRecipes(recipes);
        const withIds = recipes.map((r, i) => ({ ...r, id: ids[i] }));
        this.state.setRecipes(withIds);
        this.recipes.set(withIds);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  /** Returns the selected cuisine preference for display */
  get cuisineTag(): string {
    return this.state.request()?.cuisine ?? '';
  }

  /** Returns the selected complexity for display */
  get complexityTag(): string {
    return this.state.request()?.complexity ?? '';
  }
}
