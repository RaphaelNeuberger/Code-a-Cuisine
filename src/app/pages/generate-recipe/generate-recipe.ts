import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IngredientInput } from '../../shared/components/ingredient-input/ingredient-input';
import { RecipeStateService } from '../../shared/services/recipe-state.service';
import { Ingredient } from '../../shared/models/recipe.model';

@Component({
  selector: 'app-generate-recipe',
  imports: [IngredientInput],
  templateUrl: './generate-recipe.html',
  styleUrl: './generate-recipe.scss',
})
export class GenerateRecipe {
  private readonly state = inject(RecipeStateService);
  private readonly router = inject(Router);

  readonly ingredients = signal<Ingredient[]>([]);

  get canProceed(): boolean {
    return this.ingredients().length > 0;
  }

  onIngredientsChange(ingredients: Ingredient[]): void {
    this.ingredients.set(ingredients);
  }

  goToPreferences(): void {
    this.state.setIngredients(this.ingredients());
    this.router.navigate(['/ingredients'], { queryParams: { step: 2 } });
  }
}
