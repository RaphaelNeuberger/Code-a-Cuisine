import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IngredientInput } from '../../shared/components/ingredient-input/ingredient-input';
import { Tag } from '../../shared/components/tag/tag';
import { RecipeStateService } from '../../shared/services/recipe-state.service';
import { Ingredient, CuisineType, DietType, ComplexityType } from '../../shared/models/recipe.model';
import { RecipeRequest } from '../../shared/models/request.model';
import { FormsModule } from '@angular/forms';

const CUISINES: CuisineType[] = ['german', 'italian', 'japanese', 'indian', 'gourmet', 'fusion'];
const CUISINE_LABELS: Record<CuisineType, string> = {
  german: 'German', italian: 'Italian', japanese: 'Japanese',
  indian: 'Indian', gourmet: 'Gourmet', fusion: 'Fusion'
};
const DIETS: DietType[] = ['vegetarian', 'vegan', 'keto', 'none'];
const DIET_LABELS: Record<DietType, string> = {
  vegetarian: 'Vegetarisch', vegan: 'Vegan', keto: 'Keto', none: 'Keine Einschränkung'
};
const COMPLEXITIES: ComplexityType[] = ['quick', 'medium', 'complex'];
const COMPLEXITY_LABELS: Record<ComplexityType, string> = {
  quick: 'Quick', medium: 'Medium', complex: 'Complex'
};
const COMPLEXITY_DESC: Record<ComplexityType, string> = {
  quick: 'bis 20 Min', medium: '25–40 Min', complex: 'über 45 Min'
};

/** Two-step recipe request form: ingredients (step 1) and preferences (step 2) */
@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [IngredientInput, Tag, FormsModule, RouterLink],
  templateUrl: './ingredients.html',
  styleUrl: './ingredients.scss'
})
export class Ingredients {
  private readonly state = inject(RecipeStateService);
  private readonly router = inject(Router);

  readonly step = signal<1 | 2>(1);
  readonly cuisines = CUISINES;
  readonly cuisineLabels = CUISINE_LABELS;
  readonly diets = DIETS;
  readonly dietLabels = DIET_LABELS;
  readonly complexities = COMPLEXITIES;
  readonly complexityLabels = COMPLEXITY_LABELS;
  readonly complexityDesc = COMPLEXITY_DESC;

  ingredients: Ingredient[] = [];
  portions = 2;
  chefs = 1;
  selectedCuisine: CuisineType = 'italian';
  selectedDiet: DietType = 'none';
  selectedComplexity: ComplexityType = 'quick';

  /** Updates ingredient list when IngredientInput emits changes */
  onIngredientsChange(list: Ingredient[]): void {
    this.ingredients = list;
  }

  /** Returns true when at least one ingredient has been added */
  get canProceed(): boolean {
    return this.ingredients.length >= 1;
  }

  /** Advances to the preferences step */
  goToStep2(): void {
    this.step.set(2);
  }

  /** Returns to the ingredient input step */
  goToStep1(): void {
    this.step.set(1);
  }

  /** Increments portions counter up to max 12 */
  increasePortions(): void {
    if (this.portions < 12) this.portions++;
  }

  /** Decrements portions counter down to min 1 */
  decreasePortions(): void {
    if (this.portions > 1) this.portions--;
  }

  /** Increments chefs counter up to max 3 */
  increaseChefs(): void {
    if (this.chefs < 3) this.chefs++;
  }

  /** Decrements chefs counter down to min 1 */
  decreaseChefs(): void {
    if (this.chefs > 1) this.chefs--;
  }

  /** Builds RecipeRequest, stores in state, navigates to recipe-suggestions */
  generate(): void {
    const request: RecipeRequest = {
      ingredients: this.ingredients,
      portions: this.portions,
      chefs: this.chefs,
      complexity: this.selectedComplexity,
      cuisine: this.selectedCuisine,
      diet: this.selectedDiet
    };
    this.state.setRequest(request);
    this.router.navigate(['/recipe-suggestions']);
  }
}
