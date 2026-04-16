import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IngredientInput } from '../../shared/components/ingredient-input/ingredient-input';
import { RecipeStateService } from '../../shared/services/recipe-state.service';
import { Ingredient } from '../../shared/models/recipe.model';

/** Intermediate step that collects ingredients before navigating to preferences. */
@Component({
  selector: 'app-generate-recipe',
  imports: [IngredientInput],
  templateUrl: './generate-recipe.html',
  styleUrl: './generate-recipe.scss',
})
export class GenerateRecipe implements OnInit {
  private readonly state = inject(RecipeStateService);
  private readonly router = inject(Router);

  readonly ingredients = signal<Ingredient[]>([]);

  ngOnInit(): void {
    const saved = this.state.ingredients();
    if (saved.length > 0) {
      this.ingredients.set(saved);
    }
  }

  /** Returns true when at least one ingredient has been added. */
  get canProceed(): boolean {
    return this.ingredients().length > 0;
  }

  /** Syncs the ingredient list from the child input component. */
  onIngredientsChange(ingredients: Ingredient[]): void {
    this.ingredients.set(ingredients);
  }

  /** Persists ingredients to state and navigates to the preferences step. */
  goToPreferences(): void {
    this.state.setIngredients(this.ingredients());
    this.state.setRecipes([]);
    this.router.navigate(['/ingredients'], { queryParams: { step: 2 } });
  }
}
